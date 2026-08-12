from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import users, courses, lessons, exercises, gamification

# Create all tables on startup (Alembic handles migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Duolingo Clone API",
    description="Backend for the Duolingo clone assignment",
    version="1.0.0",
)

# ------------------------------------------------------------------ #
# CORS                                                                 #
# ------------------------------------------------------------------ #
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------ #
# Routers                                                              #
# ------------------------------------------------------------------ #
API_PREFIX = "/api/v1"
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(courses.router, prefix=API_PREFIX)
app.include_router(lessons.router, prefix=API_PREFIX)
app.include_router(exercises.router, prefix=API_PREFIX)
app.include_router(gamification.router, prefix=API_PREFIX)


# ------------------------------------------------------------------ #
# Global exception handler                                            #
# ------------------------------------------------------------------ #
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"data": None, "error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred"}},
    )


# ------------------------------------------------------------------ #
# Health check                                                         #
# ------------------------------------------------------------------ #
@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Duolingo Clone API", "docs": "/docs"}
