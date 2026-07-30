from pathlib import Path
import shutil
import subprocess
from datetime import date, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.resume import Resume
from app.services.latex_render import render_resume
from uuid import UUID
from fastapi import HTTPException, status


def _sortable_date(value):
    if value is None:
        return date.min
    if isinstance(value, datetime):
        return value.date()
    return value


def _sortable_number(value):
    if value is None:
        return 0
    return value


class PDFService:

    BASE_DIR = Path(__file__).resolve().parents[2]

    TEMP_DIR = BASE_DIR / "temp"

    OUTPUT_DIR = BASE_DIR / "generated"

    def __init__(self, db: Session):
        self.db = db

        self.TEMP_DIR.mkdir(exist_ok=True)
        self.OUTPUT_DIR.mkdir(exist_ok=True)

    def get_resume(
        self,
        resume_id: UUID,
        user_id: UUID,
    ):
        stmt = (
            select(Resume)
            .where(
                Resume.id == resume_id,
                Resume.user_id == user_id,
            )
            .options(
                joinedload(Resume.user),
                joinedload(Resume.educations),
                joinedload(Resume.experiences),
                joinedload(Resume.projects),
                joinedload(Resume.skills),
                joinedload(Resume.certifications),
                joinedload(Resume.achievements),
                joinedload(Resume.positions_of_responsibility),
            )
        )

        resume = self.db.execute(stmt).unique().scalar_one_or_none()

        if resume is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found.",
            )

        return resume

    def build_context(self, resume: Resume):

        user = resume.user

        educations = sorted(
            resume.educations,
            key=lambda x: _sortable_number(x.end_year),
            reverse=True,
        )

        experiences = sorted(
            resume.experiences,
            key=lambda x: _sortable_date(x.start_date),
            reverse=True,
        )

        projects = sorted(
            resume.projects,
            key=lambda x: _sortable_date(x.start_date or x.end_date),
            reverse=True,
        )

        certifications = sorted(
            resume.certifications,
            key=lambda x: _sortable_date(x.issue_date),
            reverse=True,
        )

        achievements = sorted(
            resume.achievements,
            key=lambda x: _sortable_date(x.achievement_date),
            reverse=True,
        )

        positions = sorted(
            resume.positions_of_responsibility,
            key=lambda x: _sortable_date(x.start_date),
            reverse=True,
        )

        skill_group_labels = [
            ("Programming Languages", ["PROGRAMMING_LANGUAGE"]),
            ("Technologies", ["FRAMEWORK", "DATABASE", "CLOUD"]),
            ("Tools", ["TOOL"]),
            ("Other", ["OTHER"]),
        ]

        skill_groups = {}

        for label, categories in skill_group_labels:
            names = sorted(
                skill.name
                for skill in resume.skills
                if skill.category.value in categories
            )
            if names:
                skill_groups[label] = names

        logo_path = (
            self.BASE_DIR
            / "templates"
            / "resume"
            / "logo.png"
        )

        context = {
            "user": user,
            "resume": resume,
            "educations": educations,
            "experiences": experiences,
            "projects": projects,
            "skill_groups": skill_groups,
            "certifications": certifications,
            "achievements": achievements,
            "positions_of_responsibility": positions,
            "has_logo": logo_path.exists(),
            "header_department": user.branch,
        }

        return context

    def compile_pdf(
        self,
        latex_content: str,
        resume_id: int,
    ) -> Path:

        # Create a permanent debug folder
        temp_dir = self.TEMP_DIR / "debug"
        temp_dir.mkdir(parents=True, exist_ok=True)

        tex_file = temp_dir / "resume.tex"
        pdf_file = temp_dir / "resume.pdf"

        # Save rendered LaTeX
        tex_file.write_text(
            latex_content,
            encoding="utf-8",
        )

        print(f"Saved TEX: {tex_file}")

        # Copy logo if it exists
        logo_source = (
            self.BASE_DIR
            / "templates"
            / "resume"
            / "logo.png"
        )

        if logo_source.exists():
            shutil.copy(
                logo_source,
                temp_dir / "logo.png",
            )

        result = subprocess.run(
            [
                "pdflatex",
                "-interaction=nonstopmode",
                "resume.tex",
            ],
            cwd=temp_dir,
            capture_output=True,
            text=True,
        )

        print(result.stdout)
        print(result.stderr)

        if result.returncode != 0:
            raise RuntimeError("PDF generation failed.")

        output_pdf = self.OUTPUT_DIR / f"resume_{resume_id}.pdf"

        shutil.copy(
            pdf_file,
            output_pdf,
        )

        return output_pdf
            

    def generate_pdf(
        self,
        resume_id: UUID,
        user_id: UUID,
    ):

        resume = self.get_resume(
            resume_id=resume_id,
            user_id=user_id,
        )

        context = self.build_context(resume)

        latex_content = render_resume(context)

        pdf_path = self.compile_pdf(
            latex_content,
            resume_id,
        )
        resume.pdf_path = f"generated/{pdf_path.name}"
        self.db.commit()
        self.db.refresh(resume)

        return pdf_path

    