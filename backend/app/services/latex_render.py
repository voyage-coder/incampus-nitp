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
        .replace("^", r"\textasciicircum{}")
    )


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

# Register the filter
env.filters["latex_escape"] = latex_escape


def render_resume(data: dict) -> str:
    template = env.get_template("main.tex")
    return template.render(**data)