import { useEffect, useRef, useState } from "react";

interface ADHDFocusSectionProps {
  isDark?: boolean;
}

export default function ADHDFocusSection({ isDark }: ADHDFocusSectionProps) {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleStart = () => {
    setDone(false);
    setTimeLeft(30);
    setRunning(true);
  };

  const handleReset = () => {
    setRunning(false);
    setDone(false);
    setTimeLeft(30);
  };

  const progress = ((30 - timeLeft) / 30) * 100;

  return (
    <section
      id="adhd"
      className="py-20 px-4 section-light"
      style={{
        background: isDark ? "oklch(0.17 0.06 275)" : "oklch(0.96 0.03 275)",
        transition: "background-color 0.4s ease",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-10 fade-in-up">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: isDark
                ? "oklch(0.28 0.10 285 / 0.5)"
                : "oklch(0.88 0.08 285)",
              color: isDark ? "oklch(0.72 0.14 290)" : "oklch(0.35 0.14 290)",
            }}
          >
            ADHD Focus Reset
          </span>
          <h2
            className="font-display font-bold text-4xl mb-3"
            style={{
              color: isDark ? "oklch(0.88 0.04 265)" : "oklch(0.18 0.02 250)",
            }}
          >
            Attention Reset in 30 Seconds
          </h2>
          <p
            className="text-lg"
            style={{
              color: isDark ? "oklch(0.62 0.04 265)" : "oklch(0.42 0.02 250)",
            }}
          >
            Stare at the dot. Follow the pulse. Let your thoughts drift away.
          </p>
        </div>

        {/* Focus dot */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            {running && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: isDark
                    ? "oklch(0.60 0.14 290 / 0.2)"
                    : "oklch(0.68 0.14 290 / 0.2)",
                  animation:
                    "pulse-dot 3s cubic-bezier(0.45, 0, 0.55, 1) infinite",
                  transform: "scale(2.5)",
                }}
              />
            )}
            <div
              className={`w-16 h-16 rounded-full ${running ? "pulse-dot" : ""}`}
              style={{
                background: running
                  ? "radial-gradient(circle at 35% 35%, oklch(0.80 0.14 290), oklch(0.58 0.18 290))"
                  : isDark
                    ? "oklch(0.40 0.12 285)"
                    : "oklch(0.82 0.09 285)",
                boxShadow: running
                  ? isDark
                    ? "0 0 30px oklch(0.65 0.14 290 / 0.7)"
                    : "0 0 30px oklch(0.68 0.14 290 / 0.6)"
                  : undefined,
                transition: "background 0.5s ease, box-shadow 0.5s ease",
              }}
              data-ocid="adhd.canvas_target"
            />
          </div>
        </div>

        {/* Timer */}
        {running || done ? (
          <div className="mb-6">
            <div
              className="relative w-48 h-3 rounded-full mx-auto mb-3"
              style={{
                background: isDark
                  ? "oklch(0.28 0.08 280)"
                  : "oklch(0.88 0.06 285)",
              }}
            >
              <div
                className="absolute left-0 top-0 h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.75 0.10 225), oklch(0.68 0.14 290))",
                }}
              />
            </div>
            {!done && (
              <p
                className="font-display font-bold text-5xl"
                style={{
                  color: isDark
                    ? "oklch(0.72 0.14 290)"
                    : "oklch(0.68 0.14 290)",
                }}
              >
                {timeLeft}s
              </p>
            )}
          </div>
        ) : null}

        {done ? (
          <div className="fade-in-up" data-ocid="adhd.success_state">
            <div className="text-5xl mb-3">✨</div>
            <p
              className="font-display font-bold text-xl mb-2"
              style={{
                color: isDark ? "oklch(0.88 0.04 265)" : "oklch(0.18 0.02 250)",
              }}
            >
              Well done. You reset your focus.
            </p>
            <p
              className="mb-6"
              style={{
                color: isDark ? "oklch(0.62 0.04 265)" : "oklch(0.42 0.02 250)",
              }}
            >
              Your mind is a little quieter now. That&apos;s real progress.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="btn-calm"
              data-ocid="adhd.reset_button"
            >
              Try Again
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={running ? handleReset : handleStart}
            className="btn-calm text-base px-8 py-3"
            data-ocid="adhd.primary_button"
            style={
              running
                ? {
                    background: isDark
                      ? "oklch(0.55 0.14 290)"
                      : "oklch(0.68 0.14 290)",
                  }
                : undefined
            }
          >
            {running ? "Cancel" : "Begin Focus Reset"}
          </button>
        )}
      </div>
    </section>
  );
}
