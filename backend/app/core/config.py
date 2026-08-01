from dotenv import load_dotenv

import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
# Public URL of this API (used for absolute upload links in JSON responses)
PUBLIC_API_URL = os.getenv("PUBLIC_API_URL", "").strip().rstrip("/")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Comma-separated origins for production, e.g. http://localhost:5173,https://app.example.com
_raw_cors = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
CORS_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in _raw_cors.split(",")
    if origin.strip()
]

# Optional regex for Vercel preview/production URLs (e.g. *.vercel.app)
_cors_regex = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app").strip()
CORS_ORIGIN_REGEX = _cors_regex or None

# Google OAuth (Sign in with Google)
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
# Restrict sign-in to this email domain, e.g. nitp.ac.in → only *@nitp.ac.in
GOOGLE_ALLOWED_EMAIL_DOMAIN = os.getenv("GOOGLE_ALLOWED_EMAIL_DOMAIN", "nitp.ac.in").strip().lower()
