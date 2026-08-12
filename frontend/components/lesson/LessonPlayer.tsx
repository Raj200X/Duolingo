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

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import ChameleonMascot from "@/components/ui/ChameleonMascot";
import "./LessonPlayer.css";

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
          className="lesson-exit-btn"
          aria-label="Exit lesson"
        >
          <X size={28} strokeWidth={2.5} />
        </button>

        <div style={{ flex: 1, padding: "0 var(--space-4)" }}>
          <ProgressBar progress={progress} color="primary" />
        </div>

        <HeartsDisplay hearts={localHearts} />
      </div>

      {/* Exercise body */}
      <div className="lesson-body">
        {currentExercise && (
          <div key={currentExercise.id} className="exercise-content-area">
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
          </div>
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
      return <div className="text-body text-center">Unknown exercise type</div>;
  }
}

function LessonLoadingScreen() {
  return (
    <div className="lesson-container flex-col items-center justify-center">
      <div className="text-center">
        <div style={{ marginBottom: "var(--space-4)" }}>
          <ChameleonMascot state="loading" size={96} />
        </div>
        <div className="text-h3 text-muted" style={{ marginTop: "var(--space-4)" }}>
          Loading lesson...
        </div>
      </div>
    </div>
  );
}

function LessonErrorScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="lesson-container flex-col items-center justify-center">
      <div className="text-center p-8">
        <div style={{ fontSize: 80, marginBottom: "var(--space-4)" }}>😢</div>
        <div className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
          Failed to load lesson
        </div>
        <Button variant="primary" onClick={onBack}>Back to Home</Button>
      </div>
    </div>
  );
}
