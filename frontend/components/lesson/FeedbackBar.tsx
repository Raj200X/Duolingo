import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle } from "lucide-react";
import "./FeedbackBar.css";

interface FeedbackBarProps {
  state: "idle" | "correct" | "incorrect";
  correctAnswer?: string;
  onContinue: () => void;
}

export function FeedbackBar({ state, correctAnswer, onContinue }: FeedbackBarProps) {
  if (state === "idle") return null;

  const isCorrect = state === "correct";

  return (
    <div className={`feedback-wrapper ${state}`}>
      <div className="feedback-content">
        <div className="feedback-message-area">
          <div className="feedback-icon">
            {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
          </div>
          <div>
            <h2 className="feedback-title">
              {isCorrect ? "Excellent!" : "Correct solution:"}
            </h2>
            {!isCorrect && correctAnswer && (
              <p className="feedback-correction">{correctAnswer}</p>
            )}
          </div>
        </div>
        
        <div className="feedback-action">
          <Button 
            variant={isCorrect ? "primary" : "danger"} 
            onClick={onContinue}
            autoFocus
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
