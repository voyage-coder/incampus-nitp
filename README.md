# InCampus — NIT Patna

A full-stack campus platform for NIT Patna students: marketplace, clubs, events, PYQs, placements, lost & found, resume builder with PDF export, notifications, and admin tools — in one workspace.

**Live (production)**

| App | URL |
|-----|-----|
| Frontend | https://incampus-nitp.vercel.app |
| Backend API | https://incampus-nitp.onrender.com |

---

## Features

- **Auth** — Email/password register & login, Google OAuth, profile completion for new Google users
- **Dashboard** — Campus feed, quick actions, weekly digest, compact layout preference
- **Marketplace** — Listings with photos, wishlist, seller contact
- **Clubs** — Browse clubs, inductions, applications, events, member management
- **Events** — Campus events with registration
- **PYQs** — Upload and browse previous year papers by branch
- **Placements** — Interview experience stories
- **Lost & Found** — Post and claim items with photos
- **Resume builder** — Multi-section resume + LaTeX PDF export
- **Notifications** — In-app alerts for events, clubs, marketplace
- **Admin** — User roles, club management (admin only)

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Axios |
| Backend | FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| Auth | JWT, Google OAuth (`google-auth`) |
| PDF | Jinja2 + Tectonic (LaTeX) |
| Deploy | Vercel (frontend), Render (backend + Postgres) |

---

## Project structure

```
InCampus-NITP/
├── backend/          # FastAPI API
│   ├── app/          # Routes, models, services
│   ├── alembic/      # Database migrations
│   ├── templates/    # Resume LaTeX templates
│   ├── start.sh      # Render start (migrations + uvicorn)
│   └── render-build.sh
├── frontend/         # React SPA
│   ├── src/
│   └── vercel.json   # SPA routing rewrites
└── render.yaml       # Render service blueprint
```

---

## Local development

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL

### 1. Database

Create a database (e.g. `incampus_db`), then configure `backend/.env` from `backend/.env.example`.

### 2. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # edit DATABASE_URL, SECRET_KEY, etc.

alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

API docs: http://127.0.0.1:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # leave VITE_API_URL empty for local dev

npm run dev
```

App: http://localhost:5173

The Vite dev server proxies API and `/uploads` requests to `http://127.0.0.1:8000`.

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SECRET_KEY` | Yes | JWT signing secret (long random string) |
| `CORS_ORIGINS` | Yes | Comma-separated frontend URLs (no trailing slash) |
| `PUBLIC_API_URL` | Prod | Public API base URL for image links in JSON (e.g. `https://incampus-nitp.onrender.com`) |
| `GOOGLE_CLIENT_ID` | For Google login | OAuth 2.0 Web client ID |
| `GOOGLE_ALLOWED_EMAIL_DOMAIN` | Optional | Restrict sign-in (e.g. `nitp.ac.in`). Leave **empty** to allow any email |
| `CORS_ORIGIN_REGEX` | Optional | Defaults to `https://.*\.vercel\.app` |

See `backend/.env.example` for full comments.

### Frontend (`frontend/.env`)

| Variable | Local | Production |
|----------|-------|------------|
| `VITE_API_URL` | *(empty)* | `https://incampus-nitp.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | Your Google client ID | Same as backend `GOOGLE_CLIENT_ID` |

See `frontend/.env.example`.

---

## Google OAuth setup

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **Create credentials** → **OAuth client ID** → **Web application**
2. **Authorized JavaScript origins:**
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
   - `https://incampus-nitp.vercel.app`
3. Copy **Client ID** to:
   - `GOOGLE_CLIENT_ID` (backend)
   - `VITE_GOOGLE_CLIENT_ID` (frontend)
4. OAuth consent screen → add **Test users** while app is in Testing mode
5. Only the **Client ID** is needed (not the client secret)

**Google sign-up flow:** User signs in with Google → completes profile (roll number, branch, password) → dashboard.

---

## Database migrations

Migrations run automatically on server start via `start.sh`. To run manually:

```bash
cd backend
alembic upgrade head
```

To create a new migration after model changes:

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

---

## Deployment

### Backend (Render)

| Setting | Value |
|---------|--------|
| Root directory | `backend` |
| Build command | `bash render-build.sh` |
| Start command | `bash start.sh` |
| Health check | `/health` |

Set all backend env vars from the table above. Run `alembic upgrade head` once via Render Shell if needed.

`render.yaml` in the repo can be used as a blueprint.

### Frontend (Vercel)

| Setting | Value |
|---------|--------|
| Root directory | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |

Env: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`

`frontend/vercel.json` handles SPA client-side routing.

---

## Uploads & images

Uploaded files (profile photos, marketplace, lost & found) are stored on the backend under `/uploads/`.

- API responses return **absolute URLs** when `PUBLIC_API_URL` is set
- On Render’s free tier, local disk uploads may be **lost after redeploy** — for production persistence, use Cloudinary or S3 later

---

## API overview

| Prefix | Area |
|--------|------|
| `/auth` | Register, login, Google OAuth |
| `/users` | Profile, profile image |
| `/marketplace` | Listings, image upload |
| `/lost-found` | Lost & found items |
| `/clubs`, `/events`, `/applications` | Clubs & events |
| `/pyqs`, `/placement-experiences` | Academics & placements |
| `/resume`, `/resume/pdf` | Resume builder & PDF |
| `/notifications` | User notifications |
| `/admin` | Admin user & club management |
| `/health` | Health check (includes PDF engine status) |

Interactive docs: `{API_URL}/docs`

---

## Scripts

**Backend**

```bash
uvicorn app.main:app --reload          # Dev server
alembic upgrade head                   # Apply migrations
```

**Frontend**

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## License

Academic / campus project for NIT Patna. Adjust licensing as needed for your use case.
