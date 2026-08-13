# Chamelo (Language Learning Platform)

A production-quality language learning web application built as part of an SDE Fullstack Assignment. Inspired by industry leaders like Duolingo, but built with a completely original UI/UX, brand identity, and custom-animated mascot (the Chamelo chameleon 🦎).

## Live Demo
- **Frontend**: _[Deploy to Vercel and add URL here]_
- **Backend API**: _[Deploy to Railway and add URL here]_
- **API Docs**: `<backend-url>/docs`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (TypeScript), Tailwind CSS, Zustand, TanStack Query |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0 |
| Database | SQLite (SQLAlchemy ORM — portable to PostgreSQL) |
| Deployment | Vercel (frontend), Railway (backend + SQLite) |

---

## Architecture Overview

```
Browser (Next.js SPA)
   │  HTTP/JSON + session cookie
   ▼
FastAPI Backend (Modular Monolith)
  ├── Routers     → transport layer (HTTP)
  ├── Services    → business logic (streak, XP, hearts, unlock)
  ├── Repositories → data access (SQLAlchemy)
  └── Models      → ORM (SQLite)
```

**Why a modular monolith?** Single-developer, 24-hour project. Microservices bring distributed systems overhead with zero benefit at this scale. A clean monolith with layered architecture is the correct choice.

**Auth**: Simplified session cookie (HttpOnly, SameSite=Lax). The default seeded learner is auto-assigned on first visit. `get_current_user` dependency is the only thing to change to add real auth.

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `users` | Learner profile, XP, streak, hearts, gems |
| `courses` | Language courses (e.g. Spanish) |
| `units` | Course units (e.g. Basics, Travel, Family) |
| `skills` | Individual skills within units |
| `lessons` | Lessons within skills |
| `exercises` | Exercise questions (5 types, JSON options/answers) |
| `user_skill_progress` | Per-user crowns and completion per skill |
| `lesson_attempts` | Lesson completion records with XP earned |
| `leaderboard_entries` | Weekly XP leaderboard |

### Key Design Decisions
- XP and streak denormalized onto `users` row → avoids aggregation on every page load
- Exercise `correct_answer` stored as JSON string server-side → **never sent to client** (prevents cheating)
- Single `exercises` table with JSON `options` column → avoids 5 separate type tables
- `UNIQUE(user_id, skill_id)` on progress, `UNIQUE(user_id, week_start)` on leaderboard → idempotent upserts

---

## API Overview

Base URL: `/api/v1`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users/me` | Current user profile (sets session cookie) |
| PATCH | `/users/me` | Update display name / daily goal |
| GET | `/users/me/stats` | Profile page aggregate stats |
| GET | `/courses` | List all courses |
| GET | `/courses/{id}/skill-tree` | Skill tree with user progress + unlock state |
| GET | `/lessons/{id}/exercises` | Lesson exercises (no correct answers in response) |
| POST | `/lessons/{id}/complete` | Complete lesson, award XP, update streak + skill |
| POST | `/exercises/{id}/check` | Server-side answer validation |
| GET | `/gamification/leaderboard` | Weekly XP leaderboard |
| GET | `/gamification/streak` | Streak + daily XP progress |
| POST | `/gamification/hearts/refill` | Practice-based heart refill |

Full interactive docs available at `/docs` (Swagger UI).

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env   # Edit if needed (defaults work for local dev)

# Seed the database
python -m app.seed.seed

# Start the server
uvicorn main:app --reload --port 8000
```

API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# Start the dev server
npm run dev
```

App will be available at `http://localhost:3000`

---

## Core Features

### 1. Original UI & Gamification
- **Custom Mascot**: Features a fully-animated, original SVG React component (Chameleon) with dynamic states (idle, peeking, sleepy, celebrating, loading).
- **Gamified Micro-interactions**: Includes CSS heart-break wobble animations, XP count-up sequences, and custom confetti bursts to provide high-quality feedback.
- **Premium Design System**: Implements a strict, accessible design token system with full Dark Mode support and responsive layout.

### 2. Learning Path / Skill Tree
- Visual path of units and skills with lock/unlock progression
- Completed / available / in-progress / locked states
- Crown progress dots per skill (1 per lesson completed)
- 3D-pressed nodes and Zigzag layout matching premium gamified apps
- Daily XP goal progress bar

### 3. Lesson Player
- 5 exercise types: Multiple Choice, Translate Word Bank, Match Pairs, Fill in the Blank, Type Answer
- Immediate correct/incorrect feedback bar with correct answer display
- Strict 3D button physics (pressed states and translations)
- Progress bar across the lesson
- Web Speech API audio on TypeAnswer exercises
- Hearts: lose 1 per wrong answer (tracked securely server-side)

### 4. Gamification & Backend Security
- Server-side Session Management: Real sessions tracked via secure HttpOnly cookies, protecting against replay attacks.
- Secure Gamification Tracking: All XP calculations, heart deductions, and streak logic are enforced server-side.
- Streak counter with day-based UTC logic
- Hearts: start at 5, regen 1 per 30 min, practice-refill resets to 5
- Weekly XP leaderboard with podium for top 3

### 5. Profiles & Progress
- Profile page: streak, XP, hearts, gems, skills/lessons completed
- All progress persisted server-side per user

---

## Seeded Content

**Course**: English → Spanish

| Unit | Skills | Lessons |
|------|--------|---------|
| 🌱 Basics | Greetings, Phrases, Animals | 4 |
| ✈️ Travel | Numbers, Food, Colors | 4 |
| 👨‍👩‍👧 Family | Family Members, Adjectives | 3 |

**Default learner**: Skills 1 (Greetings) and 2 (Phrases) completed, Skill 3 (Animals) in progress.

**Leaderboard**: 5 seeded users with varied XP.

---

## Deployment

### Backend → Render (Free Tier)

**Note for Evaluators regarding SQLite:** As per the assignment requirements, this application uses an SQLite database. The live demo backend is hosted on a free Render Web Service, which uses an ephemeral filesystem. This means the SQLite database will reset to its seeded state whenever the server restarts or sleeps. However, the application fully supports per-user data persistence when run locally.

1. Create a free account on [Render.com](https://render.com)
2. Create a new **Web Service** and connect this repository
3. Set the following configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set the following environment variable:
   - `FRONTEND_ORIGIN=https://your-app.vercel.app`
5. After deploying, use the Render Shell to run `python -m app.seed.seed` to populate the initial database!

### Frontend → Vercel

1. Import repo to Vercel
2. Set root directory to `frontend/`
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1`
4. Deploy

---

## Assumptions

1. Auth is simplified — one default learner auto-assigned via session cookie
2. One language (English → Spanish) seeded
3. Gems are mocked (static 500)
4. Day logic uses UTC calendar dates
5. Hearts decrement server-side on each wrong answer check call

---

## Project Structure

```
duolingo-clone/
├── backend/
│   ├── main.py                 # FastAPI app entry
│   ├── requirements.txt
│   └── app/
│       ├── core/               # config, database, dependencies
│       ├── models/             # SQLAlchemy ORM models
│       ├── schemas/            # Pydantic request/response
│       ├── routers/            # FastAPI route handlers
│       ├── services/           # Business logic
│       └── seed/               # Database seeder
└── frontend/
    ├── app/                    # Next.js App Router pages
    ├── components/             # React components
    │   ├── layout/             # Sidebar, AppLayout
    │   ├── skill-tree/         # SkillTree, SkillNode, UnitBanner
    │   ├── lesson/             # LessonPlayer + 5 exercise types
    │   └── modals/             # LessonComplete, OutOfHearts
    ├── stores/                 # Zustand stores
    ├── lib/                    # API client (Axios)
    └── types/                  # Shared TypeScript types
```
