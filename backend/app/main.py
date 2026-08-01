from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import (
    root,
    users,
    auth,
    admin,
    club,
    recruitment_drive,
    club_application,
    membership,
    event,
    event_registration,
    placement_experience,
    marketplace,
    lost_found,
    pyq,
    resume,
    education,
    experience,
    project,
    skill,
    achievement,
    certification,
    position_of_responsibilty,
    resume_pdf,
)
from app.notifications.router import router as notifications_router
from app.core.config import CORS_ORIGINS, CORS_ORIGIN_REGEX
from app.db.migrations import run_migrations
from app.utils.pdf_engine import ensure_pdf_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    ensure_pdf_engine()
    yield


app = FastAPI(
    title="InCampus NITP API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

app.include_router(root.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(users.router)
app.include_router(club.router)
app.include_router(recruitment_drive.router)
app.include_router(club_application.router)
app.include_router(membership.router)
app.include_router(event.router)
app.include_router(event_registration.router)
app.include_router(placement_experience.router)
app.include_router(marketplace.router)
app.include_router(lost_found.router)
app.include_router(pyq.router)
app.include_router(resume.router)
app.include_router(education.router)
app.include_router(experience.router)
app.include_router(project.router)
app.include_router(skill.router)
app.include_router(achievement.router)
app.include_router(certification.router)
app.include_router(position_of_responsibilty.router)
app.include_router(resume_pdf.router)
app.include_router(notifications_router)
