"use client";

import { useState, KeyboardEvent } from "react";
import type { Exercise } from "@/types";
import "./Exercise.css";

interface TypeAnswerProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  correctAnswer?: string;
  userAnswer?: string;
}

export function TypeAnswer({ exercise, onAnswer, disabled, correctAnswer, userAnswer }: TypeAnswerProps) {
  const [value, setValue] = useState(userAnswer || "");

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

  // Web Speech API audio playback for the prompt
  function speakPrompt() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(exercise.prompt);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="exercise-prompt">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          {exercise.prompt}
          <button
            onClick={speakPrompt}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, padding: 4 }}
            title="Listen"
            aria-label="Listen to prompt"
          >
            🔊
          </button>
        </div>
        {exercise.prompt_translation && (
          <div className="exercise-prompt-sub">{exercise.prompt_translation}</div>
        )}
      </div>

      <input
        className={`fill-blank-input ${getInputClass()}`}
        style={{ marginTop: 8, fontSize: 20 }}
        value={disabled ? (userAnswer || value) : value}
        onChange={(e) => !disabled && setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="Type your answer..."
        autoFocus
      />

      {exercise.hint && !correctAnswer && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
          💡 {exercise.hint}
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
