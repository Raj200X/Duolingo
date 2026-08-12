from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    DATABASE_URL: str = "sqlite:///./duolingo.db"
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    COOKIE_SECRET: str = "change-me-to-a-random-32-char-secret-string"
    DEBUG: bool = True
    DEFAULT_USER_ID: int = 1

    # Gamification constants
    HEARTS_MAX: int = 5
    HEART_REGEN_MINUTES: int = 30
    BONUS_XP_FULL_HEARTS: int = 5
    DEFAULT_XP_PER_LESSON: int = 10
    DEFAULT_DAILY_XP_GOAL: int = 50


settings = Settings()
