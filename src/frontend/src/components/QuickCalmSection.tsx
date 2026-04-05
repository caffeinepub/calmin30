import { useEffect, useRef, useState } from "react";

const CARDS = [
  {
    id: "breathe",
    emoji: "🌬️",
    text: "Take a slow, deep breath",
    sub: "Inhale for 4 counts, exhale for 6",
    bg: "oklch(0.92 0.06 215)",
    darkBg: "oklch(0.22 0.08 225)",
    accent: "oklch(0.72 0.10 225)",
    darkAccent: "oklch(0.60 0.12 225)",
  },
  {
    id: "feet",
    emoji: "🦶",
    text: "Notice your feet on the floor",
    sub: "Feel the ground. You are supported.",
    bg: "oklch(0.92 0.05 260)",
    darkBg: "oklch(0.22 0.08 265)",
    accent: "oklch(0.68 0.10 260)",
    darkAccent: "oklch(0.58 0.10 265)",
  },
  {
    id: "shoulders",
    emoji: "🙆",
    text: "Relax your shoulders",
    sub: "Let them drop away from your ears",
    bg: "oklch(0.92 0.06 285)",
    darkBg: "oklch(0.22 0.08 285)",
    accent: "oklch(0.68 0.14 290)",
    darkAccent: "oklch(0.58 0.14 290)",
  },
  {
    id: "jaw",
    emoji: "😌",
    text: "Unclench your jaw",
    sub: "Soften your face. Allow ease.",
    bg: "oklch(0.92 0.05 195)",
    darkBg: "oklch(0.22 0.08 195)",
    accent: "oklch(0.68 0.10 195)",
    darkAccent: "oklch(0.58 0.10 195)",
  },
  {
    id: "safe",
    emoji: "💙",
    text: "You are safe right now",
    sub: "This moment is enough. You are okay.",
    bg: "oklch(0.94 0.04 230)",
    darkBg: "oklch(0.22 0.06 235)",
    accent: "oklch(0.65 0.10 230)",
    darkAccent: "oklch(0.58 0.10 235)",
  },
];

interface QuickCalmSectionProps {
  isDark?: boolean;
}

export default function QuickCalmSection({ isDark }: QuickCalmSectionProps) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!auto) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % CARDS.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [auto]);

  const handleNext = () => {
    setAuto(false);
    setIndex((i) => (i + 1) % CARDS.length);
  };

  const handlePrev = () => {
    setAuto(false);
    setIndex((i) => (i - 1 + CARDS.length) % CARDS.length);
  };

  const card = CARDS[index];

  return (
    <section
      id="calm"
      className="py-20 px-4 section-alt"
      style={{
        background: isDark ? "oklch(0.19 0.05 268)" : "oklch(0.98 0.008 220)",
        transition: "background-color 0.4s ease",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-10 fade-in-up">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: isDark
                ? "oklch(0.28 0.08 270 / 0.5)"
                : "oklch(0.90 0.06 215)",
              color: isDark ? "oklch(0.72 0.12 285)" : "oklch(0.40 0.12 230)",
            }}
          >
            Quick Calm
          </span>
          <h2
            className="font-display font-bold text-4xl mb-3"
            style={{
              color: isDark ? "oklch(0.88 0.04 265)" : "oklch(0.18 0.02 250)",
            }}
          >
            Body Scan Moments
          </h2>
          <p
            style={{
              color: isDark ? "oklch(0.62 0.04 265)" : "oklch(0.42 0.02 250)",
            }}
          >
            One gentle reminder at a time. Auto-cycles every 5 seconds.
          </p>
        </div>

        <div
          className="card-calm p-10 md:p-14 mb-6 transition-all duration-500"
          style={{ background: isDark ? card.darkBg : card.bg }}
          data-ocid="calm.card"
        >
          <div className="text-7xl mb-5">{card.emoji}</div>
          <p
            className="font-display font-bold text-2xl md:text-3xl mb-3"
            style={{
              color: isDark ? "oklch(0.88 0.04 265)" : "oklch(0.18 0.02 250)",
            }}
          >
            {card.text}
          </p>
          <p
            className="text-base"
            style={{
              color: isDark ? "oklch(0.62 0.04 265)" : "oklch(0.42 0.02 250)",
            }}
          >
            {card.sub}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: isDark
                ? "oklch(0.25 0.06 270 / 0.8)"
                : "oklch(1 0 0 / 0.8)",
              border: isDark
                ? "1px solid oklch(0.35 0.08 270)"
                : "1px solid oklch(0.88 0.04 220)",
              color: isDark ? "oklch(0.72 0.08 265)" : "inherit",
            }}
            data-ocid="calm.pagination_prev"
          >
            ←
          </button>
          <div className="flex gap-1.5">
            {CARDS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setAuto(false);
                  setIndex(i);
                }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "1.5rem" : "0.5rem",
                  height: "0.5rem",
                  background:
                    i === index
                      ? isDark
                        ? card.darkAccent
                        : card.accent
                      : isDark
                        ? "oklch(0.30 0.06 270)"
                        : "oklch(0.85 0.04 220)",
                }}
                data-ocid="calm.tab"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: isDark
                ? "oklch(0.25 0.06 270 / 0.8)"
                : "oklch(1 0 0 / 0.8)",
              border: isDark
                ? "1px solid oklch(0.35 0.08 270)"
                : "1px solid oklch(0.88 0.04 220)",
              color: isDark ? "oklch(0.72 0.08 265)" : "inherit",
            }}
            data-ocid="calm.pagination_next"
          >
            →
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAuto((a) => !a)}
          className="text-sm px-4 py-2 rounded-full transition-all"
          style={{
            background: auto
              ? isDark
                ? "oklch(0.28 0.10 280 / 0.5)"
                : "oklch(0.90 0.06 215)"
              : isDark
                ? "oklch(0.25 0.06 270 / 0.5)"
                : "oklch(0.88 0.04 220)",
            color: isDark ? "oklch(0.72 0.12 285)" : "oklch(0.40 0.12 230)",
          }}
          data-ocid="calm.toggle"
        >
          {auto ? "⏸ Pause auto-cycle" : "▶ Resume auto-cycle"}
        </button>
      </div>
    </section>
  );
}
