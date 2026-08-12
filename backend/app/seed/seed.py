"""
Seed script: populates the database with course content and sample users.
Run: python -m app.seed.seed
"""
import json
import sys
import os
from datetime import date, timedelta, datetime

# Ensure backend root is in path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from app.core.database import SessionLocal, engine, Base
from app.models import (
    User, Course, Unit, Skill, Lesson, Exercise,
    UserSkillProgress, LessonAttempt, LeaderboardEntry,
)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Idempotent: skip if already seeded
        if db.query(Course).count() > 0:
            print("✅ Database already seeded. Skipping.")
            return

        print("🌱 Seeding database...")

        # ------------------------------------------------------------------ #
        # Course                                                               #
        # ------------------------------------------------------------------ #
        course = Course(name="Spanish", description="Learn Spanish from English", flag_emoji="🇪🇸")
        db.add(course)
        db.flush()

        # ------------------------------------------------------------------ #
        # Units                                                                #
        # ------------------------------------------------------------------ #
        unit1 = Unit(course_id=course.id, title="Basics", description="Start your Spanish journey", order_index=1, color_hex="#58CC02", icon="🌱")
        unit2 = Unit(course_id=course.id, title="Travel", description="Navigate the world in Spanish", order_index=2, color_hex="#1CB0F6", icon="✈️")
        unit3 = Unit(course_id=course.id, title="Family", description="Talk about your family", order_index=3, color_hex="#CE82FF", icon="👨‍👩‍👧")
        db.add_all([unit1, unit2, unit3])
        db.flush()

        # ------------------------------------------------------------------ #
        # Skills & Lessons & Exercises                                         #
        # ------------------------------------------------------------------ #

        # --- Unit 1: Basics ---
        skill_greetings = Skill(unit_id=unit1.id, title="Greetings", description="Hello and goodbye", order_index=1, icon="👋", xp_per_lesson=10, total_lessons=1)
        skill_phrases = Skill(unit_id=unit1.id, title="Phrases", description="Common everyday phrases", order_index=2, icon="💬", xp_per_lesson=10, total_lessons=1)
        skill_animals = Skill(unit_id=unit1.id, title="Animals", description="Cats, dogs, and more", order_index=3, icon="🐾", xp_per_lesson=10, total_lessons=2)
        db.add_all([skill_greetings, skill_phrases, skill_animals])
        db.flush()

        # Lesson: Greetings
        lesson_greetings = Lesson(skill_id=skill_greetings.id, title="Greetings", order_index=1)
        db.add(lesson_greetings)
        db.flush()
        db.add_all([
            Exercise(lesson_id=lesson_greetings.id, type="multiple_choice", order_index=1,
                     prompt="What does 'Hola' mean?",
                     prompt_translation=None,
                     correct_answer="Hello",
                     options=json.dumps(["Hello", "Goodbye", "Thank you", "Please"])),
            Exercise(lesson_id=lesson_greetings.id, type="translate_wordbank", order_index=2,
                     prompt="Translate: Good morning",
                     prompt_translation="Buenos días",
                     correct_answer="Buenos días",
                     options=json.dumps(["Buenos", "días", "noches", "tardes", "Hola"])),
            Exercise(lesson_id=lesson_greetings.id, type="type_answer", order_index=3,
                     prompt="How do you say 'Goodbye' in Spanish?",
                     prompt_translation=None,
                     correct_answer="Adiós",
                     hint="Starts with 'A'"),
            Exercise(lesson_id=lesson_greetings.id, type="multiple_choice", order_index=4,
                     prompt="What does 'Buenas noches' mean?",
                     prompt_translation=None,
                     correct_answer="Good night",
                     options=json.dumps(["Good morning", "Good afternoon", "Good night", "Good evening"])),
            Exercise(lesson_id=lesson_greetings.id, type="fill_blank", order_index=5,
                     prompt="Buenas ___, how do you say good afternoon?",
                     prompt_translation=None,
                     correct_answer="tardes",
                     hint="Time after noon"),
        ])

        # Lesson: Phrases
        lesson_phrases = Lesson(skill_id=skill_phrases.id, title="Useful Phrases", order_index=1)
        db.add(lesson_phrases)
        db.flush()
        db.add_all([
            Exercise(lesson_id=lesson_phrases.id, type="multiple_choice", order_index=1,
                     prompt="What does '¿Cómo estás?' mean?",
                     correct_answer="How are you?",
                     options=json.dumps(["What is your name?", "How are you?", "Where are you from?", "How old are you?"])),
            Exercise(lesson_id=lesson_phrases.id, type="translate_wordbank", order_index=2,
                     prompt="Translate: Thank you very much",
                     prompt_translation="Muchas gracias",
                     correct_answer="Muchas gracias",
                     options=json.dumps(["Muchas", "gracias", "por", "favor", "de", "nada"])),
            Exercise(lesson_id=lesson_phrases.id, type="type_answer", order_index=3,
                     prompt="How do you say 'Please' in Spanish?",
                     correct_answer="Por favor",
                     hint="Two words"),
            Exercise(lesson_id=lesson_phrases.id, type="fill_blank", order_index=4,
                     prompt="De ___ means 'You're welcome'",
                     correct_answer="nada",
                     hint="Means 'nothing'"),
            Exercise(lesson_id=lesson_phrases.id, type="multiple_choice", order_index=5,
                     prompt="'Me llamo' means:",
                     correct_answer="My name is",
                     options=json.dumps(["I am from", "My name is", "I like", "I have"])),
        ])

        # Lessons: Animals (2 lessons)
        lesson_animals1 = Lesson(skill_id=skill_animals.id, title="Common Animals", order_index=1)
        lesson_animals2 = Lesson(skill_id=skill_animals.id, title="Animal Sentences", order_index=2)
        db.add_all([lesson_animals1, lesson_animals2])
        db.flush()
        db.add_all([
            Exercise(lesson_id=lesson_animals1.id, type="multiple_choice", order_index=1,
                     prompt="What is 'el perro'?",
                     correct_answer="The dog",
                     options=json.dumps(["The cat", "The dog", "The bird", "The fish"])),
            Exercise(lesson_id=lesson_animals1.id, type="match_pairs", order_index=2,
                     prompt="Match the animals",
                     correct_answer=json.dumps([{"l": "cat", "r": "el gato"}, {"l": "dog", "r": "el perro"}, {"l": "bird", "r": "el pájaro"}]),
                     options=json.dumps([{"l": "cat", "r": "el gato"}, {"l": "dog", "r": "el perro"}, {"l": "bird", "r": "el pájaro"}])),
            Exercise(lesson_id=lesson_animals1.id, type="translate_wordbank", order_index=3,
                     prompt="Translate: The cat is big",
                     correct_answer="El gato es grande",
                     options=json.dumps(["El", "gato", "es", "grande", "pequeño", "perro"])),
            Exercise(lesson_id=lesson_animals1.id, type="fill_blank", order_index=4,
                     prompt="El ___ es pequeño (The fish is small)",
                     correct_answer="pez",
                     hint="Lives in water"),
            Exercise(lesson_id=lesson_animals1.id, type="type_answer", order_index=5,
                     prompt="How do you say 'The bird' in Spanish?",
                     correct_answer="El pájaro",
                     hint="Starts with 'El p'"),
        ])
        db.add_all([
            Exercise(lesson_id=lesson_animals2.id, type="multiple_choice", order_index=1,
                     prompt="'El caballo' means:",
                     correct_answer="The horse",
                     options=json.dumps(["The cow", "The horse", "The pig", "The sheep"])),
            Exercise(lesson_id=lesson_animals2.id, type="translate_wordbank", order_index=2,
                     prompt="Translate: The horse is fast",
                     correct_answer="El caballo es rápido",
                     options=json.dumps(["El", "caballo", "es", "rápido", "lento", "grande"])),
            Exercise(lesson_id=lesson_animals2.id, type="type_answer", order_index=3,
                     prompt="Say 'The cow' in Spanish",
                     correct_answer="La vaca"),
            Exercise(lesson_id=lesson_animals2.id, type="fill_blank", order_index=4,
                     prompt="La ___ da leche (The cow gives milk)",
                     correct_answer="vaca"),
            Exercise(lesson_id=lesson_animals2.id, type="multiple_choice", order_index=5,
                     prompt="'El cerdo' means:",
                     correct_answer="The pig",
                     options=json.dumps(["The sheep", "The goat", "The pig", "The duck"])),
        ])

        # --- Unit 2: Travel ---
        skill_numbers = Skill(unit_id=unit2.id, title="Numbers", description="Count in Spanish", order_index=1, icon="🔢", xp_per_lesson=12, total_lessons=1)
        skill_food = Skill(unit_id=unit2.id, title="Food", description="Order food in Spanish", order_index=2, icon="🍕", xp_per_lesson=12, total_lessons=2)
        skill_colors = Skill(unit_id=unit2.id, title="Colors", description="Describe the world in color", order_index=3, icon="🎨", xp_per_lesson=12, total_lessons=1)
        db.add_all([skill_numbers, skill_food, skill_colors])
        db.flush()

        lesson_numbers = Lesson(skill_id=skill_numbers.id, title="1 to 10", order_index=1)
        db.add(lesson_numbers)
        db.flush()
        db.add_all([
            Exercise(lesson_id=lesson_numbers.id, type="multiple_choice", order_index=1,
                     prompt="What is 'cinco'?",
                     correct_answer="5",
                     options=json.dumps(["3", "4", "5", "6"])),
            Exercise(lesson_id=lesson_numbers.id, type="match_pairs", order_index=2,
                     prompt="Match the numbers",
                     correct_answer=json.dumps([{"l": "one", "r": "uno"}, {"l": "two", "r": "dos"}, {"l": "three", "r": "tres"}]),
                     options=json.dumps([{"l": "one", "r": "uno"}, {"l": "two", "r": "dos"}, {"l": "three", "r": "tres"}])),
            Exercise(lesson_id=lesson_numbers.id, type="type_answer", order_index=3,
                     prompt="How do you say '7' in Spanish?",
                     correct_answer="siete"),
            Exercise(lesson_id=lesson_numbers.id, type="fill_blank", order_index=4,
                     prompt="___ means ten in Spanish",
                     correct_answer="diez"),
            Exercise(lesson_id=lesson_numbers.id, type="multiple_choice", order_index=5,
                     prompt="'Ocho' means:",
                     correct_answer="8",
                     options=json.dumps(["6", "7", "8", "9"])),
        ])

        lesson_food1 = Lesson(skill_id=skill_food.id, title="Food Basics", order_index=1)
        lesson_food2 = Lesson(skill_id=skill_food.id, title="At the Restaurant", order_index=2)
        db.add_all([lesson_food1, lesson_food2])
        db.flush()
        db.add_all([
            Exercise(lesson_id=lesson_food1.id, type="multiple_choice", order_index=1,
                     prompt="'El agua' means:",
                     correct_answer="The water",
                     options=json.dumps(["The juice", "The milk", "The water", "The wine"])),
            Exercise(lesson_id=lesson_food1.id, type="translate_wordbank", order_index=2,
                     prompt="Translate: I want bread",
                     correct_answer="Quiero pan",
                     options=json.dumps(["Quiero", "pan", "agua", "leche", "como"])),
            Exercise(lesson_id=lesson_food1.id, type="type_answer", order_index=3,
                     prompt="How do you say 'apple' in Spanish?",
                     correct_answer="manzana"),
            Exercise(lesson_id=lesson_food1.id, type="fill_blank", order_index=4,
                     prompt="La ___ es roja (The apple is red)",
                     correct_answer="manzana"),
            Exercise(lesson_id=lesson_food1.id, type="multiple_choice", order_index=5,
                     prompt="'La leche' means:",
                     correct_answer="The milk",
                     options=json.dumps(["The water", "The juice", "The milk", "The coffee"])),
        ])
        db.add_all([
            Exercise(lesson_id=lesson_food2.id, type="multiple_choice", order_index=1,
                     prompt="'La cuenta, por favor' means:",
                     correct_answer="The bill, please",
                     options=json.dumps(["The menu, please", "The bill, please", "The water, please", "The food, please"])),
            Exercise(lesson_id=lesson_food2.id, type="translate_wordbank", order_index=2,
                     prompt="Translate: I would like coffee",
                     correct_answer="Quisiera café",
                     options=json.dumps(["Quisiera", "café", "agua", "leche", "Quiero"])),
            Exercise(lesson_id=lesson_food2.id, type="type_answer", order_index=3,
                     prompt="How do you say 'breakfast' in Spanish?",
                     correct_answer="desayuno"),
            Exercise(lesson_id=lesson_food2.id, type="fill_blank", order_index=4,
                     prompt="El ___ es delicioso (The breakfast is delicious)",
                     correct_answer="desayuno"),
            Exercise(lesson_id=lesson_food2.id, type="multiple_choice", order_index=5,
                     prompt="'La cena' means:",
                     correct_answer="Dinner",
                     options=json.dumps(["Breakfast", "Lunch", "Dinner", "Snack"])),
        ])

        lesson_colors = Lesson(skill_id=skill_colors.id, title="Colors", order_index=1)
        db.add(lesson_colors)
        db.flush()
        db.add_all([
            Exercise(lesson_id=lesson_colors.id, type="multiple_choice", order_index=1,
                     prompt="'Rojo' means:",
                     correct_answer="Red",
                     options=json.dumps(["Blue", "Green", "Red", "Yellow"])),
            Exercise(lesson_id=lesson_colors.id, type="match_pairs", order_index=2,
                     prompt="Match the colors",
                     correct_answer=json.dumps([{"l": "blue", "r": "azul"}, {"l": "green", "r": "verde"}, {"l": "yellow", "r": "amarillo"}]),
                     options=json.dumps([{"l": "blue", "r": "azul"}, {"l": "green", "r": "verde"}, {"l": "yellow", "r": "amarillo"}])),
            Exercise(lesson_id=lesson_colors.id, type="type_answer", order_index=3,
                     prompt="How do you say 'white' in Spanish?",
                     correct_answer="blanco"),
            Exercise(lesson_id=lesson_colors.id, type="fill_blank", order_index=4,
                     prompt="El cielo es ___ (The sky is blue)",
                     correct_answer="azul"),
            Exercise(lesson_id=lesson_colors.id, type="multiple_choice", order_index=5,
                     prompt="'Negro' means:",
                     correct_answer="Black",
                     options=json.dumps(["White", "Grey", "Black", "Brown"])),
        ])

        # --- Unit 3: Family ---
        skill_family = Skill(unit_id=unit3.id, title="Family Members", description="Parents, siblings, and more", order_index=1, icon="👨‍👩‍👧", xp_per_lesson=15, total_lessons=2)
        skill_adjectives = Skill(unit_id=unit3.id, title="Adjectives", description="Describe people and things", order_index=2, icon="✨", xp_per_lesson=15, total_lessons=1)
        db.add_all([skill_family, skill_adjectives])
        db.flush()

        lesson_family1 = Lesson(skill_id=skill_family.id, title="Parents & Siblings", order_index=1)
        lesson_family2 = Lesson(skill_id=skill_family.id, title="Extended Family", order_index=2)
        lesson_adj = Lesson(skill_id=skill_adjectives.id, title="Adjectives", order_index=1)
        db.add_all([lesson_family1, lesson_family2, lesson_adj])
        db.flush()

        db.add_all([
            Exercise(lesson_id=lesson_family1.id, type="multiple_choice", order_index=1,
                     prompt="'La madre' means:",
                     correct_answer="The mother",
                     options=json.dumps(["The father", "The mother", "The sister", "The brother"])),
            Exercise(lesson_id=lesson_family1.id, type="match_pairs", order_index=2,
                     prompt="Match family members",
                     correct_answer=json.dumps([{"l": "father", "r": "padre"}, {"l": "mother", "r": "madre"}, {"l": "brother", "r": "hermano"}]),
                     options=json.dumps([{"l": "father", "r": "padre"}, {"l": "mother", "r": "madre"}, {"l": "brother", "r": "hermano"}])),
            Exercise(lesson_id=lesson_family1.id, type="translate_wordbank", order_index=3,
                     prompt="Translate: My sister is young",
                     correct_answer="Mi hermana es joven",
                     options=json.dumps(["Mi", "hermana", "es", "joven", "vieja", "hermano"])),
            Exercise(lesson_id=lesson_family1.id, type="type_answer", order_index=4,
                     prompt="How do you say 'My father' in Spanish?",
                     correct_answer="Mi padre"),
            Exercise(lesson_id=lesson_family1.id, type="fill_blank", order_index=5,
                     prompt="Mi ___ se llama Carlos (My brother is named Carlos)",
                     correct_answer="hermano"),
        ])
        db.add_all([
            Exercise(lesson_id=lesson_family2.id, type="multiple_choice", order_index=1,
                     prompt="'El abuelo' means:",
                     correct_answer="The grandfather",
                     options=json.dumps(["The uncle", "The cousin", "The grandfather", "The nephew"])),
            Exercise(lesson_id=lesson_family2.id, type="match_pairs", order_index=2,
                     prompt="Match extended family",
                     correct_answer=json.dumps([{"l": "grandfather", "r": "abuelo"}, {"l": "grandmother", "r": "abuela"}, {"l": "uncle", "r": "tío"}]),
                     options=json.dumps([{"l": "grandfather", "r": "abuelo"}, {"l": "grandmother", "r": "abuela"}, {"l": "uncle", "r": "tío"}])),
            Exercise(lesson_id=lesson_family2.id, type="type_answer", order_index=3,
                     prompt="How do you say 'cousin' in Spanish?",
                     correct_answer="primo"),
            Exercise(lesson_id=lesson_family2.id, type="fill_blank", order_index=4,
                     prompt="Mi ___ es doctor (My uncle is a doctor)",
                     correct_answer="tío"),
            Exercise(lesson_id=lesson_family2.id, type="multiple_choice", order_index=5,
                     prompt="'La abuela' means:",
                     correct_answer="The grandmother",
                     options=json.dumps(["The aunt", "The grandmother", "The daughter", "The niece"])),
        ])
        db.add_all([
            Exercise(lesson_id=lesson_adj.id, type="multiple_choice", order_index=1,
                     prompt="'Grande' means:",
                     correct_answer="Big",
                     options=json.dumps(["Small", "Fast", "Big", "Slow"])),
            Exercise(lesson_id=lesson_adj.id, type="translate_wordbank", order_index=2,
                     prompt="Translate: The small dog is fast",
                     correct_answer="El perro pequeño es rápido",
                     options=json.dumps(["El", "perro", "pequeño", "es", "rápido", "grande", "lento"])),
            Exercise(lesson_id=lesson_adj.id, type="type_answer", order_index=3,
                     prompt="How do you say 'beautiful' in Spanish?",
                     correct_answer="hermoso"),
            Exercise(lesson_id=lesson_adj.id, type="fill_blank", order_index=4,
                     prompt="La ciudad es ___ (The city is beautiful)",
                     correct_answer="hermosa"),
            Exercise(lesson_id=lesson_adj.id, type="multiple_choice", order_index=5,
                     prompt="'Inteligente' means:",
                     correct_answer="Intelligent",
                     options=json.dumps(["Strong", "Fast", "Intelligent", "Brave"])),
        ])

        # ------------------------------------------------------------------ #
        # Users                                                                #
        # ------------------------------------------------------------------ #
        today = date.today()
        week_start = today - timedelta(days=today.weekday())

        users_data = [
            # Default learner (id=1)
            User(username="learner", display_name="You", avatar_url=None,
                 xp_total=85, streak_count=3, last_activity=today - timedelta(days=1),
                 hearts=5, gems=500, daily_xp_goal=50),
            # Leaderboard competitors
            User(username="sofia_r", display_name="Sofia R.", avatar_url=None,
                 xp_total=320, streak_count=14, last_activity=today, hearts=5, gems=1200, daily_xp_goal=50),
            User(username="kai_m", display_name="Kai M.", avatar_url=None,
                 xp_total=210, streak_count=7, last_activity=today, hearts=4, gems=800, daily_xp_goal=50),
            User(username="ana_p", display_name="Ana P.", avatar_url=None,
                 xp_total=155, streak_count=5, last_activity=today, hearts=3, gems=600, daily_xp_goal=50),
            User(username="luca_b", display_name="Luca B.", avatar_url=None,
                 xp_total=60, streak_count=2, last_activity=today, hearts=5, gems=300, daily_xp_goal=50),
        ]
        db.add_all(users_data)
        db.flush()

        # Default learner: Greetings completed (1 crown), Phrases completed (1 crown),
        # Animals lesson 1 in progress (1 crown)
        learner = users_data[0]
        db.add_all([
            UserSkillProgress(user_id=learner.id, skill_id=skill_greetings.id, crowns=1, completed=True,
                              last_practiced=datetime.utcnow() - timedelta(days=2)),
            UserSkillProgress(user_id=learner.id, skill_id=skill_phrases.id, crowns=1, completed=True,
                              last_practiced=datetime.utcnow() - timedelta(days=1)),
            UserSkillProgress(user_id=learner.id, skill_id=skill_animals.id, crowns=1, completed=False,
                              last_practiced=datetime.utcnow() - timedelta(hours=5)),
        ])

        # Leaderboard entries for this week
        lb_data = [
            LeaderboardEntry(user_id=users_data[0].id, xp_this_week=85, week_start=week_start),
            LeaderboardEntry(user_id=users_data[1].id, xp_this_week=320, week_start=week_start),
            LeaderboardEntry(user_id=users_data[2].id, xp_this_week=210, week_start=week_start),
            LeaderboardEntry(user_id=users_data[3].id, xp_this_week=155, week_start=week_start),
            LeaderboardEntry(user_id=users_data[4].id, xp_this_week=60, week_start=week_start),
        ]
        db.add_all(lb_data)

        db.commit()
        print("✅ Seeding complete!")
        print(f"   Course: Spanish ({course.id})")
        print(f"   Units: 3, Skills: 8, Lessons: 11")
        print(f"   Users: {len(users_data)} (default learner id=1)")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
