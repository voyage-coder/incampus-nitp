from fastapi import FastAPI
from app.api import root, users, auth, admin
from app.core.config import DATABASE_URL
# from app.api.auth import router as auth_router
# from app.api.admin import router as admin_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title = "InCampus NITP API",
    version = "1.0.0" 
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)
# fastapi automatically serves everything inside the folder

print(DATABASE_URL)

app.include_router(root.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(users.router)
