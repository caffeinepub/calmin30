import { useEffect, useRef, useState } from "react";

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out" | "idle";

const PHASES: {
  phase: Phase;
  duration: number;
  label: string;
  color: string;
  glow: string;
}[] = [
  {
    phase: "inhale",
    duration: 4,
    label: "Inhale",
    color: "#8EC5FF",
    glow: "oklch(0.75 0.10 225 / 0.6)",
  },
  {
    phase: "hold-in",
    duration: 4,
    label: "Hold",
    color: "#A78BFA",
    glow: "oklch(0.68 0.14 290 / 0.6)",
  },
  {
    phase: "exhale",
    duration: 4,
    label: "Exhale",
    color: "#6DD8CF",
    glow: "oklch(0.75 0.10 195 / 0.6)",
  },
  {
    phase: "hold-out",
    duration: 2,
    label: "Hold",
    color: "#A78BFA",
    glow: "oklch(0.68 0.14 290 / 0.6)",
  },
];

const CIRCUMFERENCE = 2 * Math.PI * 88;

interface BreathingWidgetProps {
  isDark?: boolean;
}

export default function BreathingWidget({ isDark }: BreathingWidgetProps) {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIndexRef = useRef(phaseIndex);
  phaseIndexRef.current = phaseIndex;

  const currentPhase = PHASES[phaseIndex];
  const progress = elapsed / currentPhase.duration;

  let dashOffset: number;
  if (currentPhase.phase === "inhale") {
    dashOffset = CIRCUMFERENCE * (1 - progress);
  } else if (currentPhase.phase === "exhale") {
    dashOffset = CIRCUMFERENCE * progress;
  } else {
    dashOffset = currentPhase.phase === "hold-in" ? 0 : CIRCUMFERENCE;
  }

  const secondsLeft = Math.ceil(currentPhase.duration - elapsed);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const phase = PHASES[phaseIndexRef.current];
        const next = prev + 0.05;
        if (next >= phase.duration) {
          setPhaseIndex((pi) => (pi + 1) % PHASES.length);
          return 0;
        }
        return next;
      });
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleToggle = () => {
    if (!running) {
      setPhaseIndex(0);
      setElapsed(0);
    }
    setRunning((r) => !r);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative"
        style={{
          filter: running
            ? `drop-shadow(0 0 24px ${currentPhase.glow})`
            : undefined,
        }}
      >
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          aria-label="Breathing guide ring"
          role="img"
        >
          <title>Breathing guide ring</title>
          <circle
            cx="110"
            cy="110"
            r="88"
            fill="none"
            stroke={isDark ? "oklch(0.28 0.08 270)" : "oklch(0.90 0.04 220)"}
            strokeWidth="10"
          />
          <circle
            cx="110"
            cy="110"
            r="88"
            fill="none"
            stroke={
              running ? currentPhase.color : isDark ? "#7C6FAA" : "#9EBCE6"
            }
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={running ? dashOffset : CIRCUMFERENCE * 0.25}
            transform="rotate(-90 110 110)"
            style={{
              transition: "stroke-dashoffset 0.05s linear, stroke 0.8s ease",
            }}
          />
          <foreignObject x="30" y="30" width="160" height="160">
            <div
              style={{ width: "160px", height: "160px" }}
              className="flex flex-col items-center justify-center"
            >
              {running ? (
                <>
                  <span
                    className="font-display font-bold text-4xl"
                    style={{
                      color: currentPhase.color,
                      transition: "color 0.8s ease",
                    }}
                  >
                    {secondsLeft}s
                  </span>
                  <span
                    className="font-display font-semibold text-sm mt-1"
                    style={{
                      color: currentPhase.color,
                      transition: "color 0.8s ease",
                    }}
                  >
                    {currentPhase.label}
                  </span>
                </>
              ) : (
                <span
                  className="font-display font-semibold text-sm text-center px-4"
                  style={{
                    color: isDark
                      ? "oklch(0.62 0.06 265)"
                      : "oklch(0.42 0.02 250)",
                  }}
                >
                  Press Start
                </span>
              )}
            </div>
          </foreignObject>
        </svg>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        data-ocid="breathing.toggle"
        className="btn-calm font-display font-semibold text-base px-8 py-3"
      >
        {running ? "Pause" : "Start Breathing"}
      </button>

      {running && (
        <p
          className="text-sm text-center"
          style={{
            color: isDark ? "oklch(0.58 0.06 265)" : "oklch(0.42 0.02 250)",
          }}
        >
          Box breathing · 4-4-4-2 pattern
        </p>
      )}
    </div>
  );
}
