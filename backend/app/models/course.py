from datetime import datetime
from sqlalchemy import Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    flag_emoji: Mapped[str | None] = mapped_column(String(10), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    units: Mapped[list["Unit"]] = relationship(
        "Unit", back_populates="course", order_by="Unit.order_index", lazy="select"
    )


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    color_hex: Mapped[str] = mapped_column(String(7), default="#58CC02")
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    course: Mapped["Course"] = relationship("Course", back_populates="units")
    skills: Mapped[list["Skill"]] = relationship(
        "Skill", back_populates="unit", order_by="Skill.order_index", lazy="select"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    unit_id: Mapped[int] = mapped_column(Integer, ForeignKey("units.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    xp_per_lesson: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    total_lessons: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    unit: Mapped["Unit"] = relationship("Unit", back_populates="skills")
    lessons: Mapped[list["Lesson"]] = relationship(
        "Lesson", back_populates="skill", order_by="Lesson.order_index", lazy="select"
    )
    user_progress: Mapped[list["UserSkillProgress"]] = relationship(
        "UserSkillProgress", back_populates="skill", lazy="select"
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("skills.id"), nullable=False, index=True)
    title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    skill: Mapped["Skill"] = relationship("Skill", back_populates="lessons")
    exercises: Mapped[list["Exercise"]] = relationship(
        "Exercise", back_populates="lesson", order_by="Exercise.order_index", lazy="select"
    )
    attempts: Mapped[list["LessonAttempt"]] = relationship(
        "LessonAttempt", back_populates="lesson", lazy="select"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_id: Mapped[int] = mapped_column(Integer, ForeignKey("lessons.id"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(30), nullable=False)  # See ExerciseType enum in schemas
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    prompt: Mapped[str] = mapped_column(String(1000), nullable=False)
    prompt_translation: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    correct_answer: Mapped[str] = mapped_column(String(2000), nullable=False)  # JSON string
    options: Mapped[str | None] = mapped_column(String(2000), nullable=True)  # JSON string
    hint: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="exercises")


# Avoid circular imports
from app.models.progress import UserSkillProgress, LessonAttempt  # noqa: E402, F401
