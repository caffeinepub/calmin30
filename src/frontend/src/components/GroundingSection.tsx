import { useState } from "react";

const STEPS = [
  {
    count: 5,
    sense: "SEE",
    icon: "👁️",
    instruction: "Look around slowly. Name 5 things you can see right now.",
    color: "oklch(0.75 0.10 225)",
    bg: "oklch(0.92 0.05 215)",
    darkBg: "oklch(0.22 0.08 225)",
    darkColor: "oklch(0.72 0.12 225)",
  },
  {
    count: 4,
    sense: "TOUCH",
    icon: "✋",
    instruction:
      "Notice 4 things you can physically feel — your chair, clothes, floor...",
    color: "oklch(0.70 0.10 260)",
    bg: "oklch(0.92 0.05 260)",
    darkBg: "oklch(0.22 0.08 265)",
    darkColor: "oklch(0.68 0.12 265)",
  },
  {
    count: 3,
    sense: "HEAR",
    icon: "👂",
    instruction: "Listen carefully. What 3 sounds can you hear right now?",
    color: "oklch(0.68 0.14 290)",
    bg: "oklch(0.92 0.06 285)",
    darkBg: "oklch(0.22 0.08 285)",
    darkColor: "oklch(0.68 0.14 290)",
  },
  {
    count: 2,
    sense: "SMELL",
    icon: "👃",
    instruction: "Take a slow breath. Notice 2 things you can smell.",
    color: "oklch(0.70 0.10 195)",
    bg: "oklch(0.92 0.05 195)",
    darkBg: "oklch(0.22 0.08 195)",
    darkColor: "oklch(0.68 0.12 195)",
  },
  {
    count: 1,
    sense: "TASTE",
    icon: "👅",
    instruction: "Pay attention to your mouth. What 1 thing can you taste?",
    color: "oklch(0.72 0.12 30)",
    bg: "oklch(0.94 0.04 30)",
    darkBg: "oklch(0.22 0.08 30)",
    darkColor: "oklch(0.72 0.14 30)",
  },
];

interface GroundingSectionProps {
  isDark?: boolean;
}

export default function GroundingSection({ isDark }: GroundingSectionProps) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const current = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  const handleReset = () => {
    setStep(0);
    setDone(false);
  };

  return (
    <section
      id="grounding"
      className="py-20 px-4 section-alt"
      style={{
        background: isDark ? "oklch(0.19 0.05 270)" : "oklch(0.97 0.02 220)",
        transition: "background-color 0.4s ease",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 fade-in-up">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: isDark
                ? "oklch(0.28 0.08 270 / 0.5)"
                : "oklch(0.90 0.06 215)",
              color: isDark ? "oklch(0.72 0.12 285)" : "oklch(0.40 0.12 230)",
            }}
          >
            Grounding Technique
          </span>
          <h2
            className="font-display font-bold text-4xl mb-3"
            style={{
              color: isDark ? "oklch(0.88 0.04 265)" : "oklch(0.18 0.02 250)",
            }}
          >
            5-4-3-2-1 Grounding
          </h2>
          <p
            className="text-lg"
            style={{
              color: isDark ? "oklch(0.62 0.04 265)" : "oklch(0.42 0.02 250)",
            }}
          >
            Anchor yourself to the present moment in under 2 minutes.
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s) => (
            <div
              key={s.sense}
              className="rounded-full transition-all duration-300"
              style={{
                width: STEPS.indexOf(s) === step && !done ? "2rem" : "0.65rem",
                height: "0.65rem",
                background:
                  STEPS.indexOf(s) <= step || done
                    ? isDark
                      ? s.darkColor
                      : s.color
                    : isDark
                      ? "oklch(0.30 0.06 270)"
                      : "oklch(0.88 0.03 220)",
              }}
            />
          ))}
        </div>

        {done ? (
          <div
            className="card-calm p-10 text-center fade-in-up"
            data-ocid="grounding.success_state"
          >
            <div className="text-6xl mb-4">🌿</div>
            <h3
              className="font-display font-bold text-2xl mb-2"
              style={{
                color: isDark ? "oklch(0.88 0.04 265)" : "oklch(0.18 0.02 250)",
              }}
            >
              You are grounded.
            </h3>
            <p
              className="mb-6"
              style={{
                color: isDark ? "oklch(0.62 0.04 265)" : "oklch(0.42 0.02 250)",
              }}
            >
              You just pulled yourself back to the present moment. That takes
              strength.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="btn-calm"
              data-ocid="grounding.reset_button"
            >
              Start Again
            </button>
          </div>
        ) : (
          <div
            className="card-calm p-8 md:p-12 text-center fade-in-up"
            data-ocid="grounding.panel"
            style={{ background: isDark ? current.darkBg : current.bg }}
          >
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl mb-6"
              style={{
                background: isDark
                  ? "oklch(0.28 0.06 270 / 0.5)"
                  : "oklch(1 0 0 / 0.6)",
              }}
            >
              {current.icon}
            </div>
            <div className="flex items-baseline justify-center gap-3 mb-4">
              <span
                className="font-display font-bold text-8xl"
                style={{ color: isDark ? current.darkColor : current.color }}
              >
                {current.count}
              </span>
              <span
                className="font-display font-bold text-3xl"
                style={{ color: isDark ? current.darkColor : current.color }}
              >
                things you can {current.sense}
              </span>
            </div>
            <p
              className="text-lg mb-8"
              style={{
                color: isDark ? "oklch(0.65 0.04 265)" : "oklch(0.35 0.02 250)",
              }}
            >
              {current.instruction}
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="btn-calm text-base px-10 py-3"
              data-ocid="grounding.next_button"
            >
              {step < STEPS.length - 1 ? "Next Step →" : "I'm done ✓"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
