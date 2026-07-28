from fastapi import FastAPI
from app.api import root, users, auth, admin, club, recruitment_drive, club_application, membership, event, event_registration, placement_experience, marketplace, lost_found
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
app.include_router(club.router)
app.include_router(recruitment_drive.router)
app.include_router(club_application.router)
app.include_router(membership.router)
app.include_router(event.router)
app.include_router(event_registration.router)
app.include_router(placement_experience.router)
app.include_router(marketplace.router)
app.include_router(lost_found.router)