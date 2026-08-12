"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refillHearts } from "@/lib/api";

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
      <div className="modal-card animate-pop">
        <div style={{ fontSize: 80, marginBottom: 8 }}>💔</div>
        <div className="modal-title" style={{ color: "var(--duo-red-dark)" }}>
          Out of Hearts!
        </div>
        <div className="modal-subtitle">
          You&apos;ve run out of hearts. Practice to refill them or wait for regeneration.
        </div>

        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-md)",
            padding: 16,
            margin: "16px 0",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>⏱️</div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}>
            Hearts regenerate 1 every 30 minutes
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Or practice below to refill instantly
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginBottom: 12 }}
          onClick={() => doRefill()}
          disabled={isPending}
          id="refill-hearts-btn"
        >
          {isPending ? "Refilling..." : "🏋️ Practice to Refill"}
        </button>

        <button
          className="btn btn-outline"
          style={{ width: "100%" }}
          onClick={() => router.push("/learn")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
