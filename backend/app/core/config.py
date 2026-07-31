from dotenv import load_dotenv

import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
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
CORS_ORIGIN_REGEX = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app")
