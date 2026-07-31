from datetime import date, datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader


def latex_escape(text):
    if text is None:
        return ""

    return (
        str(text)
        .replace("\\", r"\textbackslash{}")
        .replace("&", r"\&")
        .replace("%", r"\%")
        .replace("$", r"\$")
        .replace("#", r"\#")
        .replace("_", r"\_")
        .replace("{", r"\{")
        .replace("}", r"\}")
        .replace("~", r"\textasciitilde{}")
        .replace("^", r"\textasciitircum{}")
    )


def format_month_year(value) -> str:
    if value is None or value == "":
        return ""

    if isinstance(value, (date, datetime)):
        return value.strftime("%b %Y")

    text = str(value).strip()
    if not text:
        return ""

    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
        return parsed.strftime("%b %Y")
    except ValueError:
        return latex_escape(text)


def format_date_range(start, end=None) -> str:
    start_text = format_month_year(start)
    if not end:
        return f"{start_text} - Present" if start_text else "Present"
    end_text = format_month_year(end)
    return f"{start_text} - {end_text}"


def display_value(value) -> str:
    if value is None:
        return ""
    if hasattr(value, "value"):
        return str(value.value)
    return str(value)


def social_handle(value, platform: str = "github") -> str:
    if not value:
        return ""

    text = str(value).strip().rstrip("/")

    if platform == "linkedin":
        if "linkedin.com/in/" in text:
            return text.split("linkedin.com/in/")[-1].split("/")[0].split("?")[0]
        return text.replace("https://", "").replace("http://", "").replace("www.", "")

    if platform == "github":
        if "github.com/" in text:
            return text.split("github.com/")[-1].split("/")[0].split("?")[0]
        return text.replace("https://", "").replace("http://", "").replace("www.", "")

    return text


def linkedin_url(value) -> str:
    handle = social_handle(value, "linkedin")
    if not handle:
        return ""
    if str(value).startswith("http"):
        return str(value).strip()
    return f"https://www.linkedin.com/in/{handle}"


def github_url(value) -> str:
    handle = social_handle(value, "github")
    if not handle:
        return ""
    if str(value).startswith("http"):
        return str(value).strip()
    return f"https://github.com/{handle}"


def latex_href_url(value) -> str:
    """Escape characters that break hyperref \\href targets."""
    if not value:
        return ""
    text = str(value).strip().replace("\\", "/")
    for char in ("%", "#", "_"):
        text = text.replace(char, f"\\{char}")
    return text


BASE_DIR = Path(__file__).resolve().parents[2]
TEMPLATE_DIR = BASE_DIR / "templates" / "resume"

env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=False,
    variable_start_string="((",
    variable_end_string="))",
    block_start_string="(%",
    block_end_string="%)",
    comment_start_string="{#jinja_comment_start#}",
    comment_end_string="{#jinja_comment_end#}",
)

env.filters["latex_escape"] = latex_escape
env.filters["format_month_year"] = format_month_year
env.filters["format_date_range"] = format_date_range
env.filters["display_value"] = display_value
env.filters["social_handle"] = social_handle
env.filters["linkedin_url"] = linkedin_url
env.filters["github_url"] = github_url
env.filters["latex_href_url"] = latex_href_url


def render_resume(data: dict) -> str:
    template = env.get_template("main.tex")
    return template.render(**data)
