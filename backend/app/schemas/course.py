from datetime import datetime
from pydantic import BaseModel
from typing import Literal


ExerciseType = Literal[
    "multiple_choice",
    "translate_wordbank",
    "match_pairs",
    "fill_blank",
    "type_answer",
]

SkillState = Literal["locked", "available", "in_progress", "completed"]


class ExercisePublic(BaseModel):
    """Exercise data sent to client — correct_answer is NEVER included."""
    id: int
    type: ExerciseType
    order_index: int
    prompt: str
    prompt_translation: str | None
    options: list | None  # parsed from JSON
    hint: str | None

    model_config = {"from_attributes": True}


class AnswerCheckRequest(BaseModel):
    answer: str | list  # string for most types, list for match_pairs
    lesson_session_id: int


class AnswerCheckResponse(BaseModel):
    correct: bool
    correct_answer: str | list  # shown after answering
    explanation: str | None = None


class SkillProgressPublic(BaseModel):
    skill_id: int
    crowns: int
    completed: bool
    last_practiced: datetime | None

    model_config = {"from_attributes": True}


class SkillPublic(BaseModel):
    id: int
    title: str
    description: str | None
    order_index: int
    icon: str | None
    xp_per_lesson: int
    total_lessons: int
    state: SkillState
    progress: SkillProgressPublic | None

    model_config = {"from_attributes": True}


class UnitPublic(BaseModel):
    id: int
    title: str
    description: str | None
    order_index: int
    color_hex: str
    icon: str | None
    skills: list[SkillPublic]

    model_config = {"from_attributes": True}


class CoursePublic(BaseModel):
    id: int
    name: str
    description: str | None
    flag_emoji: str | None

    model_config = {"from_attributes": True}


class SkillTreeResponse(BaseModel):
    course: CoursePublic
    units: list[UnitPublic]


class StartLessonResponse(BaseModel):
    session_id: int

class LessonCompleteRequest(BaseModel):
    session_id: int


class LessonCompleteResponse(BaseModel):
    xp_earned: int
    bonus_xp: int
    new_xp_total: int
    streak_count: int
    hearts_remaining: int
    skill_id: int
    crowns: int
    skill_completed: bool
