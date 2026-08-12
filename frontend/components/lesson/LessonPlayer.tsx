"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { getLessonExercises, checkAnswer, completeLesson, startLesson } from "@/lib/api";
import { useLessonStore } from "@/stores/lessonStore";
import { MultipleChoice } from "./exercises/MultipleChoice";
import { TranslateWordBank } from "./exercises/TranslateWordBank";
import { MatchPairs } from "./exercises/MatchPairs";
import { FillBlank } from "./exercises/FillBlank";
import { TypeAnswer } from "./exercises/TypeAnswer";
import { FeedbackBar } from "./FeedbackBar";
import { HeartsDisplay } from "./HeartsDisplay";
import { LessonCompleteModal } from "@/components/modals/LessonCompleteModal";
import { OutOfHeartsModal } from "@/components/modals/OutOfHeartsModal";
import type { LessonCompleteResponse, AnswerCheckResponse } from "@/types";

interface LessonPlayerProps {
  lessonId: number;
}

export function LessonPlayer({ lessonId }: LessonPlayerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const store = useLessonStore();

  const [localHearts, setLocalHearts] = useState(5);
  const [showComplete, setShowComplete] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [completeResult, setCompleteResult] = useState<LessonCompleteResponse | null>(null);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);

  // Fetch exercises
  const { data: exercises, isLoading, error } = useQuery({
    queryKey: ["lessons", lessonId, "exercises"],
    queryFn: () => getLessonExercises(lessonId),
  });

  // Initialize store and session when exercises load
  const { mutate: startSession } = useMutation({
    mutationFn: (id: number) => startLesson(id),
    onSuccess: (result) => {
      store.setLessonSessionId(result.session_id);
    }
  });

  useEffect(() => {
    if (exercises && !store.lessonSessionId) {
      store.initLesson(exercises);
      startSession(lessonId);
      // Get current hearts from user query
      const userData = queryClient.getQueryData<{ hearts: number }>(["user", "me"]);
      setLocalHearts(userData?.hearts ?? 5);
    }
  }, [exercises, lessonId]);

  // Answer checking mutation
  const { mutate: submitAnswer, isPending: isChecking } = useMutation({
    mutationFn: ({ exerciseId, answer }: { exerciseId: number; answer: string | Array<{ l: string; r: string }> }) => {
      if (!store.lessonSessionId) throw new Error("No active lesson session");
      return checkAnswer(exerciseId, answer, store.lessonSessionId);
    },
    onSuccess: (result: AnswerCheckResponse) => {
      if (result.correct) {
        store.setFeedback("correct", result);
      } else {
        store.setFeedback("incorrect", result);
        const newHearts = localHearts - 1;
        setLocalHearts(newHearts);
        if (newHearts <= 0) {
          setShowOutOfHearts(true);
        }
      }
    },
  });

  // Lesson completion mutation
  const { mutate: doComplete } = useMutation({
    mutationFn: () => {
      if (!store.lessonSessionId) throw new Error("No active lesson session");
      return completeLesson(lessonId, store.lessonSessionId);
    },
    onSuccess: (result) => {
      setCompleteResult(result);
      setShowComplete(true);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  if (isLoading) return <LessonLoadingScreen />;
  if (error || !exercises) return <LessonErrorScreen onBack={() => router.push("/learn")} />;

  const currentExercise = exercises[store.currentIndex];
  const progress = exercises.length > 0 ? (store.currentIndex / exercises.length) * 100 : 0;
  const isAnswered = store.feedbackState !== "idle";

  function handleAnswer(answer: string | Array<{ l: string; r: string }>) {
    if (!currentExercise || isChecking || isAnswered) return;
    setLastAnswer(typeof answer === "string" ? answer : JSON.stringify(answer));
    submitAnswer({ exerciseId: currentExercise.id, answer });
  }

  function handleContinue() {
    const nextIndex = store.currentIndex + 1;
    if (nextIndex >= (exercises?.length ?? 0)) {
      // Lesson finished
      doComplete();
    } else {
      store.nextExercise();
      setLastAnswer(null);
    }
  }

  function speakCurrentPrompt() {
    if (typeof window !== "undefined" && window.speechSynthesis && currentExercise) {
      const utterance = new SpeechSynthesisUtterance(currentExercise.prompt);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div className="lesson-container">
      {/* Header */}
      <div className="lesson-header">
        <button
          onClick={() => router.push("/learn")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-muted)" }}
          aria-label="Exit lesson"
        >
          <X size={24} />
        </button>

        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <HeartsDisplay hearts={localHearts} />
      </div>

      {/* Exercise body */}
      <div className="lesson-body">
        {/* Exercise counter */}
        <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 700, marginBottom: 16, alignSelf: "flex-start" }}>
          {store.currentIndex + 1} / {exercises.length}
        </div>

        {currentExercise && (
          <ExerciseRenderer
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={isAnswered || isChecking}
            correctAnswer={
              store.lastFeedback
                ? typeof store.lastFeedback.correct_answer === "string"
                  ? store.lastFeedback.correct_answer
                  : JSON.stringify(store.lastFeedback.correct_answer)
                : undefined
            }
            userAnswer={lastAnswer ?? undefined}
          />
        )}
      </div>

      {/* Feedback bar */}
      <FeedbackBar
        state={store.feedbackState}
        correctAnswer={
          store.lastFeedback
            ? typeof store.lastFeedback.correct_answer === "string"
              ? store.lastFeedback.correct_answer
              : undefined
            : undefined
        }
        onContinue={handleContinue}
      />

      {/* Modals */}
      {showComplete && completeResult && (
        <LessonCompleteModal
          result={completeResult}
          onClose={() => setShowComplete(false)}
        />
      )}

      {showOutOfHearts && (
        <OutOfHeartsModal onClose={() => setShowOutOfHearts(false)} />
      )}
    </div>
  );
}

// Exercise renderer — dispatches to the correct component based on type
function ExerciseRenderer({
  exercise,
  onAnswer,
  disabled,
  correctAnswer,
  userAnswer,
}: {
  exercise: import("@/types").Exercise;
  onAnswer: (answer: string | Array<{ l: string; r: string }>) => void;
  disabled: boolean;
  correctAnswer?: string;
  userAnswer?: string;
}) {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoice
          exercise={exercise}
          onAnswer={onAnswer as (a: string) => void}
          disabled={disabled}
          correctAnswer={correctAnswer}
          userAnswer={userAnswer}
        />
      );
    case "translate_wordbank":
      return (
        <TranslateWordBank
          exercise={exercise}
          onAnswer={onAnswer as (a: string) => void}
          disabled={disabled}
          correctAnswer={correctAnswer}
        />
      );
    case "match_pairs":
      return (
        <MatchPairs
          exercise={exercise}
          onAnswer={onAnswer as (a: Array<{ l: string; r: string }>) => void}
          disabled={disabled}
        />
      );
    case "fill_blank":
      return (
        <FillBlank
          exercise={exercise}
          onAnswer={onAnswer as (a: string) => void}
          disabled={disabled}
          correctAnswer={correctAnswer}
          userAnswer={userAnswer}
        />
      );
    case "type_answer":
      return (
        <TypeAnswer
          exercise={exercise}
          onAnswer={onAnswer as (a: string) => void}
          disabled={disabled}
          correctAnswer={correctAnswer}
          userAnswer={userAnswer}
        />
      );
    default:
      return <div>Unknown exercise type</div>;
  }
}

function LessonLoadingScreen() {
  return (
    <div className="lesson-container" style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, animation: "bob 1s ease-in-out infinite" }}>🦜</div>
        <div style={{ fontWeight: 700, color: "var(--text-secondary)", marginTop: 16 }}>
          Loading lesson...
        </div>
      </div>
    </div>
  );
}

function LessonErrorScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="lesson-container" style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64 }}>😢</div>
        <div style={{ fontWeight: 700, color: "var(--text-secondary)", margin: "16px 0" }}>
          Failed to load lesson
        </div>
        <button className="btn btn-primary" onClick={onBack}>Back to Home</button>
      </div>
    </div>
  );
}
