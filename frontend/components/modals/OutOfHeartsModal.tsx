"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refillHearts } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import "./Modals.css";

interface OutOfHeartsModalProps {
  onClose: () => void;
}

export function OutOfHeartsModal({ onClose }: OutOfHeartsModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: doRefill, isPending } = useMutation({
    mutationFn: refillHearts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      onClose();
    },
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ fontSize: 80, marginBottom: "var(--space-2)", animation: "shake 0.4s ease" }}>💔</div>
        <div className="modal-title" style={{ color: "var(--status-error-hover)" }}>
          Out of Hearts!
        </div>
        <div className="modal-subtitle">
          You&apos;ve run out of hearts. Practice to refill them or wait for regeneration.
        </div>

        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-4)",
            margin: "var(--space-6) 0",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: "var(--space-2)" }}>⏱️</div>
          <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: 17 }}>
            Hearts regenerate 1 every 30 minutes
          </div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            Or practice below to refill instantly
          </div>
        </div>

        <Button
          variant="primary"
          style={{ width: "100%", marginBottom: "var(--space-4)" }}
          onClick={() => doRefill()}
          disabled={isPending}
          id="refill-hearts-btn"
        >
          {isPending ? "Refilling..." : "🏋️ Practice to Refill"}
        </Button>

        <Button
          variant="ghost"
          style={{ width: "100%" }}
          onClick={() => router.push("/learn")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
