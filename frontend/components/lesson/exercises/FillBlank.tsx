"use client";

import { useState, KeyboardEvent } from "react";
import type { Exercise } from "@/types";

interface FillBlankProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  correctAnswer?: string;
  userAnswer?: string;
}

export function FillBlank({ exercise, onAnswer, disabled, correctAnswer, userAnswer }: FillBlankProps) {
  const [value, setValue] = useState(userAnswer || "");

  // Replace ___ in the prompt with an inline display
  const parts = exercise.prompt.split("___");

  function getInputClass() {
    if (!correctAnswer) return "";
    return value.trim().toLowerCase() === correctAnswer.toLowerCase() ? "correct" : "incorrect";
  }

  function handleSubmit() {
    if (value.trim()) onAnswer(value.trim());
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim() && !disabled) handleSubmit();
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="exercise-prompt">
        {parts.length > 1 ? (
          <span>
            {parts[0]}
            <input
              className={`fill-blank-input ${getInputClass()}`}
              style={{ display: "inline-block", width: Math.max(120, value.length * 14), margin: "0 8px" }}
              value={disabled ? (userAnswer || value) : value}
              onChange={(e) => !disabled && setValue(e.target.value)}
              onKeyDown={handleKey}
              disabled={disabled}
              placeholder="..."
              autoFocus
            />
            {parts[1]}
          </span>
        ) : (
          <>
            <div>{exercise.prompt}</div>
            <input
              className={`fill-blank-input ${getInputClass()}`}
              style={{ marginTop: 16, fontSize: 20 }}
              value={disabled ? (userAnswer || value) : value}
              onChange={(e) => !disabled && setValue(e.target.value)}
              onKeyDown={handleKey}
              disabled={disabled}
              placeholder="Type the missing word..."
              autoFocus
            />
          </>
        )}
      </div>
      {exercise.hint && !correctAnswer && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
          💡 Hint: {exercise.hint}
        </div>
      )}
      {!disabled && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!value.trim()}
            style={{ width: "100%", maxWidth: 400 }}
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}
