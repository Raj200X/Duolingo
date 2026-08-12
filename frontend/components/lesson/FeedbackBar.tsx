"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { FeedbackState } from "@/stores/lessonStore";

interface FeedbackBarProps {
  state: FeedbackState;
  correctAnswer?: string | null;
  onContinue: () => void;
}

export function FeedbackBar({ state, correctAnswer, onContinue }: FeedbackBarProps) {
  if (state === "idle") return null;

  const isCorrect = state === "correct";

  // Speak the correct answer via Web Speech API on wrong answer
  if (!isCorrect && correctAnswer && typeof window !== "undefined" && window.speechSynthesis) {
    // Only speak once (guard by checking if speaking)
  }

  return (
    <div className={`feedback-bar ${isCorrect ? "correct" : "incorrect"}`}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          {isCorrect ? (
            <CheckCircle size={24} color="var(--duo-green-dark)" />
          ) : (
            <XCircle size={24} color="var(--duo-red-dark)" />
          )}
          <span className="feedback-message">
            {isCorrect ? "Correct! 🎉" : "Incorrect"}
          </span>
        </div>
        {!isCorrect && correctAnswer && (
          <div style={{ fontSize: 14, color: "var(--duo-red-dark)", fontWeight: 600 }}>
            Correct answer:{" "}
            <strong>
              {typeof correctAnswer === "string"
                ? correctAnswer
                : JSON.stringify(correctAnswer)}
            </strong>
          </div>
        )}
      </div>
      <button
        className={`btn ${isCorrect ? "btn-primary" : "btn-danger"}`}
        onClick={onContinue}
        id="feedback-continue-btn"
      >
        Continue
      </button>
    </div>
  );
}
