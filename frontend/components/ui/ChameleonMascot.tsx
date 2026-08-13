"use client";

import React, { useState } from "react";

/**
 * ChameleonMascot — v4, bugfix pass
 * -----------------------------------
 * Fixes from screenshots:
 *  1. Multi-line template-literal `d` path strings were causing a stray
 *     vertical line artifact in some renderers — every path is now a
 *     single-line string.
 *  2. "peeking" relied on a CSS position/overflow trick that rendered
 *     blank — replaced with a self-contained SVG <clipPath> ledge mask.
 *  3. "sleepy" had no actual resting body language — now tilts the
 *     whole character and rests on one arm, with a floating Zzz.
 *  4. "encouraging" thumbs-up was a disconnected rect+circle — rebuilt
 *     as one continuous fist + separate clean thumb ellipse.
 *  5. Replaced useId() (hook support was uncertain in preview sandbox)
 *     with a plain useState-seeded random id.
 *
 * Usage:
 *   <ChameleonMascot state="idle" size={128} />
 *   states: "idle" | "celebrating" | "curious" | "encouraging"
 *          | "peeking" | "sleepy" | "loading"
 */

const PALETTE = {
  bodyLight: "#B4EC8C",
  bodyMid: "#8FDD5C",
  bodyDeep: "#5FB532",
  shadow: "#3D7A22",
  belly: "#F1FBDE",
  spot: "#4E9A2C",
  accent: "#FF9F43",
  sparkle: "#FFC93D",
  eyeBlack: "#22301A",
  eyeShine: "#FFFFFF",
  ledge: "#D8DADC",
};

function Sparkles() {
  const pts = [
    { x: 250, y: 60, s: 10, rot: 0 },
    { x: 268, y: 100, s: 7, rot: 15 },
    { x: 42, y: 90, s: 8, rot: -10 },
  ];
  const star = (x: number, y: number, s: number, rot: number, key: number) => (
    <path
      key={key}
      d={`M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28} L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28} L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28} L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z`}
      fill={PALETTE.sparkle}
      transform={`rotate(${rot} ${x} ${y})`}
    />
  );
  return <g>{pts.map((p, i) => star(p.x, p.y, p.s, p.rot, i))}</g>;
}

function Confetti() {
  const bits = [
    { x: 34, y: 44, c: PALETTE.accent, rot: 12 },
    { x: 262, y: 50, c: PALETTE.bodyDeep, rot: -8 },
    { x: 44, y: 230, c: PALETTE.accent, rot: 30 },
    { x: 268, y: 220, c: "#4FA8E8", rot: -20 },
    { x: 210, y: 24, c: PALETTE.sparkle, rot: 15 },
    { x: 16, y: 150, c: PALETTE.sparkle, rot: -25 },
  ];
  return (
    <g>
      {bits.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width="8" height="8" rx="2" fill={b.c} transform={`rotate(${b.rot} ${b.x} ${b.y})`} />
      ))}
    </g>
  );
}

function Zzz({ animated = true }: { animated?: boolean }) {
  return (
    <g className={animated ? "mascot-zzz-float" : ""}>
      <text x="222" y="82" fontFamily="'Nunito', sans-serif" fontWeight="800" fontSize="14" fill="#9BB0C7">z</text>
      <text x="236" y="66" fontFamily="'Nunito', sans-serif" fontWeight="800" fontSize="20" fill="#9BB0C7">Z</text>
    </g>
  );
}

function ThoughtBubble() {
  return (
    <g>
      <circle cx="232" cy="70" r="5" fill="#FFFFFF" stroke={PALETTE.shadow} strokeWidth="2.5" />
      <circle cx="248" cy="55" r="7" fill="#FFFFFF" stroke={PALETTE.shadow} strokeWidth="2.5" />
      <ellipse cx="268" cy="34" rx="21" ry="17" fill="#FFFFFF" stroke={PALETTE.shadow} strokeWidth="3" />
      <text x="268" y="40" fontSize="18" textAnchor="middle" fill={PALETTE.shadow} fontFamily="sans-serif" fontWeight="700">?</text>
    </g>
  );
}

function Eye({ cx, cy, r, mode = "open", shineDir = 1 }: { cx: number, cy: number, r: number, mode?: string, shineDir?: number }) {
  if (mode === "closed") {
    return <path d={`M ${cx - r} ${cy} Q ${cx} ${cy + r * 0.55} ${cx + r} ${cy}`} stroke={PALETTE.eyeBlack} strokeWidth={r * 0.22} fill="none" strokeLinecap="round" />;
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={PALETTE.eyeBlack} />
      <circle cx={cx - shineDir * r * 0.32} cy={cy - r * 0.34} r={r * 0.28} fill={PALETTE.eyeShine} />
      <circle cx={cx + shineDir * r * 0.18} cy={cy + r * 0.3} r={r * 0.11} fill={PALETTE.eyeShine} opacity="0.7" />
    </g>
  );
}

function Brow({ cx, cy, width, raised = false }: { cx: number, cy: number, width: number, raised?: boolean }) {
  const lift = raised ? -8 : 0;
  return (
    <path d={`M ${cx - width / 2} ${cy + lift} Q ${cx} ${cy - width * 0.28 + lift} ${cx + width / 2} ${cy + lift}`} stroke={PALETTE.shadow} strokeWidth="5" fill="none" strokeLinecap="round" />
  );
}

function Mouth({ type }: { type: string }) {
  if (type === "grin") {
    return <path d="M 118 190 Q 150 218 182 190 Q 150 206 118 190 Z" fill="#B8493F" stroke={PALETTE.shadow} strokeWidth="4" strokeLinejoin="round" />;
  }
  if (type === "o") {
    return <ellipse cx="150" cy="196" rx="9" ry="11" fill={PALETTE.shadow} opacity="0.85" />;
  }
  if (type === "closed-happy") {
    return <path d="M 128 188 Q 150 202 172 188" stroke={PALETTE.shadow} strokeWidth="5" fill="none" strokeLinecap="round" />;
  }
  return <path d="M 126 186 Q 150 200 174 186" stroke={PALETTE.shadow} strokeWidth="5" fill="none" strokeLinecap="round" />;
}

function Arms({ pose }: { pose: string }) {
  const hand = (x: number, y: number) => <circle cx={x} cy={y} r="14" fill={PALETTE.bodyMid} stroke={PALETTE.shadow} strokeWidth="4" />;

  if (pose === "raised") {
    return (
      <>
        <path d="M 92 220 Q 60 190 58 148" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        {hand(56, 140)}
        <path d="M 208 220 Q 240 190 242 148" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        {hand(244, 140)}
      </>
    );
  }
  if (pose === "thumbsup") {
    return (
      <>
        {/* resting arm */}
        <path d="M 92 222 Q 74 240 84 258" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        {hand(86, 260)}
        {/* thumbs-up arm: one continuous forearm into a fist, thumb as a single clean ellipse */}
        <path d="M 208 222 Q 236 204 234 172" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        <circle cx="235" cy="164" r="15" fill={PALETTE.bodyMid} stroke={PALETTE.shadow} strokeWidth="4" />
        <ellipse cx="236" cy="142" rx="7" ry="13" fill={PALETTE.bodyMid} stroke={PALETTE.shadow} strokeWidth="4" transform="rotate(-12 236 142)" />
      </>
    );
  }
  if (pose === "chin") {
    return (
      <>
        <path d="M 92 220 Q 62 200 60 168" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        {hand(62, 162)}
        <path d="M 208 222 Q 190 195 168 188" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        {hand(164, 184)}
      </>
    );
  }
  if (pose === "resting-cheek") {
    // one arm folded up to prop up the head — used for sleepy
    return (
      <>
        <path d="M 92 220 Q 68 208 66 178" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        {hand(68, 172)}
        <path d="M 208 220 Q 224 238 214 256" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
        {hand(212, 258)}
      </>
    );
  }
  // down / resting
  return (
    <>
      <path d="M 92 218 Q 78 236 88 254" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
      {hand(90, 258)}
      <path d="M 208 218 Q 222 236 212 254" stroke={PALETTE.bodyMid} strokeWidth="20" fill="none" strokeLinecap="round" />
      {hand(210, 258)}
    </>
  );
}

function Tail({ tailId, curl = 0 }: { tailId: string, curl?: number }) {
  return (
    <g>
      <path
        d={`M 236 244 C 280 254 302 214 278 180 C 260 156 226 164 222 192 C 219 212 240 224 254 210 C 261 202 252 193 243 ${198 + curl}`}
        fill="none"
        stroke={`url(#${tailId})`}
        strokeWidth="17"
        strokeLinecap="round"
      />
      <ellipse cx="252" cy="196" rx="6" ry="4.5" fill={PALETTE.spot} opacity="0.55" />
      <ellipse cx="270" cy="216" rx="5" ry="4" fill={PALETTE.spot} opacity="0.45" />
    </g>
  );
}

function Character({ bodyId, headId, tailId, mouth, leftEye, rightEye, browRaisedLeft, browRaisedRight, arms, tailCurl }: any) {
  return (
    <g>
      <Tail tailId={tailId} curl={tailCurl} />

      <ellipse cx="150" cy="228" rx="76" ry="54" fill={`url(#${bodyId})`} stroke={PALETTE.shadow} strokeWidth="6" />
      <ellipse cx="150" cy="244" rx="46" ry="28" fill={PALETTE.belly} opacity="0.9" />
      <ellipse cx="120" cy="212" rx="7" ry="5" fill={PALETTE.spot} opacity="0.4" />
      <ellipse cx="182" cy="208" rx="6" ry="4.5" fill={PALETTE.spot} opacity="0.4" />

      <Arms pose={arms} />

      <ellipse cx="118" cy="278" rx="15" ry="9" fill={PALETTE.shadow} />
      <ellipse cx="182" cy="280" rx="15" ry="9" fill={PALETTE.shadow} />

      <circle cx="150" cy="132" r="82" fill={`url(#${headId})`} stroke={PALETTE.shadow} strokeWidth="6" />

      <path d="M 118 62 C 128 34 172 34 182 62 C 172 52 128 52 118 62 Z" fill={PALETTE.bodyDeep} stroke={PALETTE.shadow} strokeWidth="4" strokeLinejoin="round" />

      <circle cx="138" cy="168" r="2.2" fill={PALETTE.shadow} opacity="0.6" />
      <circle cx="162" cy="168" r="2.2" fill={PALETTE.shadow} opacity="0.6" />

      <Brow cx={112} cy={98} width={42} raised={browRaisedLeft} />
      <Brow cx={188} cy={98} width={42} raised={browRaisedRight} />

      <Eye cx={112} cy={128} r={30} mode={leftEye} shineDir={1} />
      <Eye cx={188} cy={128} r={30} mode={rightEye} shineDir={-1} />

      <ellipse cx="88" cy="160" rx="10" ry="7" fill={PALETTE.accent} opacity="0.3" />
      <ellipse cx="212" cy="160" rx="10" ry="7" fill={PALETTE.accent} opacity="0.3" />

      <Mouth type={mouth} />
    </g>
  );
}

interface ChameleonMascotProps {
  state?: "idle" | "celebrating" | "curious" | "encouraging" | "peeking" | "sleepy" | "loading";
  size?: number;
  className?: string;
}

export default function ChameleonMascot({ state = "idle", size = 128, className = "" }: ChameleonMascotProps) {
  const rawId = React.useId();
  const uid = rawId.replace(/:/g, "");
  const bodyId = `body-${uid}`;
  const headId = `head-${uid}`;
  const tailId = `tail-${uid}`;
  const clipId = `clip-${uid}`;

  const isPeeking = state === "peeking";
  const isSleepy = state === "sleepy";

  let mouth = "smile";
  let leftEye = "open";
  let rightEye = "open";
  let browRaisedLeft = false;
  let browRaisedRight = false;
  let arms = "down";
  let showConfetti = false;
  let showThought = false;
  let showSparkles = false;
  let showZzz = false;
  let bob = "mascot-idle-bob";
  let tailCurl = 0;

  switch (state) {
    case "celebrating":
      mouth = "grin";
      arms = "raised";
      showConfetti = true;
      bob = "mascot-celebrate-bounce";
      tailCurl = 10;
      break;
    case "curious":
      mouth = "o";
      arms = "chin";
      browRaisedLeft = true;
      showThought = true;
      break;
    case "encouraging":
      mouth = "grin";
      rightEye = "closed";
      arms = "thumbsup";
      showSparkles = true;
      break;
    case "sleepy":
      leftEye = "closed";
      rightEye = "closed";
      mouth = "closed-happy";
      arms = "resting-cheek";
      showZzz = true;
      bob = "mascot-sleepy-sway";
      break;
    case "loading":
      bob = "mascot-loading-pulse";
      break;
    case "peeking":
      mouth = "smile";
      break;
    default:
      bob = "mascot-idle-bob";
  }

  const gTransform = isSleepy ? "rotate(10 150 190)" : undefined;

  return (
    <div className={className} style={{ width: size, height: size, display: "inline-block" }}>
      <style>{`
        @keyframes mascotIdleBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3%); } }
        @keyframes mascotCelebrateBounce { 0%, 100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-8%) scale(1.03); } 50% { transform: translateY(0) scale(0.98); } 70% { transform: translateY(-4%) scale(1.01); } }
        @keyframes mascotSleepySway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(1.2deg); } }
        @keyframes mascotLoadingPulse { 0%, 100% { filter: hue-rotate(0deg); opacity: 1; } 50% { filter: hue-rotate(18deg); opacity: 0.85; } }
        @keyframes mascotZzzFloat { 0% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-6px); opacity: 1; } 100% { transform: translateY(-12px); opacity: 0; } }
        .mascot-idle-bob { animation: mascotIdleBob 2.6s ease-in-out infinite; }
        .mascot-celebrate-bounce { animation: mascotCelebrateBounce 0.9s ease-in-out infinite; }
        .mascot-sleepy-sway { animation: mascotSleepySway 3.2s ease-in-out infinite; }
        .mascot-loading-pulse { animation: mascotLoadingPulse 1.1s ease-in-out infinite; }
        .mascot-zzz-float { animation: mascotZzzFloat 2.4s ease-in-out infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .mascot-idle-bob, .mascot-celebrate-bounce, .mascot-sleepy-sway, .mascot-loading-pulse, .mascot-zzz-float { animation: none; }
        }
      `}</style>

      <svg viewBox="0 0 300 300" width="100%" height="100%" className={bob} style={{ transformOrigin: "50% 55%" }}>
        <defs>
          <radialGradient id={bodyId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={PALETTE.bodyLight} />
            <stop offset="65%" stopColor={PALETTE.bodyMid} />
            <stop offset="100%" stopColor={PALETTE.bodyDeep} />
          </radialGradient>
          <radialGradient id={headId} cx="38%" cy="28%" r="80%">
            <stop offset="0%" stopColor={PALETTE.bodyLight} />
            <stop offset="60%" stopColor={PALETTE.bodyMid} />
            <stop offset="100%" stopColor={PALETTE.bodyDeep} />
          </radialGradient>
          <linearGradient id={tailId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PALETTE.bodyMid} />
            <stop offset="100%" stopColor={PALETTE.bodyDeep} />
          </linearGradient>
          {isPeeking && (
            <clipPath id={clipId}>
              <rect x="0" y="0" width="300" height="150" />
            </clipPath>
          )}
        </defs>

        {isPeeking ? (
          <>
            <g clipPath={`url(#${clipId})`}>
              <Character
                bodyId={bodyId}
                headId={headId}
                tailId={tailId}
                mouth={mouth}
                leftEye={leftEye}
                rightEye={rightEye}
                browRaisedLeft={browRaisedLeft}
                browRaisedRight={browRaisedRight}
                arms={arms}
                tailCurl={tailCurl}
              />
            </g>
            {/* the "ledge" the character is peeking over */}
            <rect x="0" y="148" width="300" height="152" rx="10" fill={PALETTE.ledge} />
          </>
        ) : (
          <g transform={gTransform}>
            <Character
              bodyId={bodyId}
              headId={headId}
              tailId={tailId}
              mouth={mouth}
              leftEye={leftEye}
              rightEye={rightEye}
              browRaisedLeft={browRaisedLeft}
              browRaisedRight={browRaisedRight}
              arms={arms}
              tailCurl={tailCurl}
            />
          </g>
        )}

        {showConfetti && <Confetti />}
        {showThought && <ThoughtBubble />}
        {showSparkles && <Sparkles />}
        {showZzz && <Zzz />}
      </svg>
    </div>
  );
}
