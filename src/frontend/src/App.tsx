import { useEffect, useState } from "react";
import ADHDFocusSection from "./components/ADHDFocusSection";
import BreathingWidget from "./components/BreathingWidget";
import GroundingSection from "./components/GroundingSection";
import QuickCalmSection from "./components/QuickCalmSection";
import SoundPanel from "./components/SoundPanel";

const FEATURE_CARDS = [
  {
    icon: "🌊",
    title: "Guided Breathing",
    description:
      "Box breathing to calm the nervous system and reduce physical anxiety responses.",
    cta: "Try it",
    targetId: "breathe",
    color: "oklch(0.92 0.06 215)",
    darkColor: "oklch(0.22 0.08 225)",
    accent: "oklch(0.72 0.10 225)",
    darkAccent: "oklch(0.60 0.12 225)",
  },
  {
    icon: "🌿",
    title: "Grounding 5-4-3-2-1",
    description:
      "Anchor yourself to the present moment and break the cycle of anxious thoughts.",
    cta: "Try it",
    targetId: "grounding",
    color: "oklch(0.92 0.06 285)",
    darkColor: "oklch(0.22 0.08 285)",
    accent: "oklch(0.68 0.14 290)",
    darkAccent: "oklch(0.58 0.14 290)",
  },
  {
    icon: "🎯",
    title: "ADHD Focus Reset",
    description:
      "Redirect attention and restore calm in 30 seconds with a guided visual focus anchor.",
    cta: "Try it",
    targetId: "adhd",
    color: "oklch(0.92 0.06 260)",
    darkColor: "oklch(0.22 0.08 265)",
    accent: "oklch(0.68 0.10 260)",
    darkAccent: "oklch(0.58 0.10 265)",
  },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function NavLink({
  targetId,
  children,
  isDark,
}: { targetId: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <button
      type="button"
      onClick={() => scrollTo(targetId)}
      className="text-sm font-medium transition-colors hover:opacity-70 cursor-pointer bg-transparent border-none p-0"
      style={{
        color: isDark ? "oklch(0.82 0.06 265)" : "oklch(0.35 0.02 250)",
      }}
      data-ocid="nav.link"
    >
      {children}
    </button>
  );
}

export default function App() {
  const year = new Date().getFullYear();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("calmin30-dark-mode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("calmin30-dark-mode", String(isDark));
  }, [isDark]);

  const toggleDark = () => setIsDark((d) => !d);

  return (
    <div
      className="min-h-screen font-body"
      style={{
        background: isDark ? "oklch(0.15 0.04 265)" : "oklch(0.98 0.008 220)",
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Navigation */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: isDark
            ? "oklch(0.17 0.05 265 / 0.92)"
            : "oklch(1 0 0 / 0.9)",
          borderColor: isDark ? "oklch(0.28 0.06 270)" : "oklch(0.92 0.04 220)",
          backdropFilter: "blur(16px)",
          transition: "background-color 0.4s ease, border-color 0.3s ease",
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => scrollTo("breathe")}
              className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer"
              data-ocid="nav.link"
            >
              <span className="text-2xl">🌸</span>
              <span
                className="font-display font-bold text-xl"
                style={{
                  color: isDark
                    ? "oklch(0.88 0.16 285)"
                    : "oklch(0.40 0.18 265)",
                }}
              >
                CalmIn30
              </span>
            </button>
            <span
              className="text-xs hidden sm:block"
              style={{
                color: isDark ? "oklch(0.68 0.08 270)" : "oklch(0.55 0.05 250)",
                letterSpacing: "0.02em",
                marginLeft: "2.2rem",
                marginTop: "-2px",
              }}
            >
              anxiety · panic attacks · adhd
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink targetId="grounding" isDark={isDark}>
              Grounding
            </NavLink>
            <NavLink targetId="adhd" isDark={isDark}>
              Reset
            </NavLink>
            <NavLink targetId="calm" isDark={isDark}>
              Body Scan
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleDark}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              data-ocid="nav.toggle"
              className="relative flex items-center w-14 h-7 rounded-full transition-all duration-400 focus:outline-none focus-visible:ring-2"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, oklch(0.35 0.12 270), oklch(0.42 0.18 295))"
                  : "oklch(0.88 0.04 220)",
                boxShadow: isDark
                  ? "0 0 12px oklch(0.55 0.14 285 / 0.5), inset 0 1px 3px oklch(0.20 0.08 265 / 0.3)"
                  : "inset 0 1px 4px oklch(0.18 0.02 250 / 0.1)",
              }}
            >
              <span
                className="absolute flex items-center justify-center w-6 h-6 rounded-full transition-all duration-350"
                style={{
                  left: isDark ? "calc(100% - 1.65rem)" : "0.18rem",
                  background: isDark ? "oklch(0.22 0.10 265)" : "white",
                  boxShadow: isDark
                    ? "0 0 8px oklch(0.70 0.18 295 / 0.7)"
                    : "0 1px 4px oklch(0.18 0.02 250 / 0.2)",
                  fontSize: "14px",
                  lineHeight: 1,
                }}
              >
                {isDark ? "🌙" : "☀️"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("breathe")}
              className="btn-calm text-sm px-5 py-2"
              data-ocid="nav.primary_button"
            >
              Start Now
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section
          id="breathe"
          className="relative overflow-hidden gradient-drift"
          style={{
            background: isDark
              ? "linear-gradient(135deg, oklch(0.18 0.07 265) 0%, oklch(0.16 0.10 290) 100%)"
              : "linear-gradient(135deg, oklch(0.90 0.06 215) 0%, oklch(0.82 0.09 285) 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            transition: "background 0.5s ease",
          }}
        >
          {/* Botanical SVG background decoration */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-10 leaf-float"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            role="presentation"
          >
            <title>Decorative background</title>
            <ellipse
              cx="650"
              cy="80"
              rx="180"
              ry="80"
              fill={isDark ? "oklch(0.60 0.12 285)" : "oklch(0.68 0.10 195)"}
              opacity="0.4"
            />
            <ellipse
              cx="100"
              cy="450"
              rx="140"
              ry="60"
              fill={isDark ? "oklch(0.55 0.14 290)" : "oklch(0.68 0.14 290)"}
              opacity="0.3"
            />
            <circle
              cx="750"
              cy="400"
              r="90"
              fill={isDark ? "oklch(0.52 0.10 270)" : "oklch(0.72 0.10 225)"}
              opacity="0.2"
            />
            <circle
              cx="50"
              cy="100"
              r="70"
              fill={isDark ? "oklch(0.50 0.10 265)" : "oklch(0.70 0.10 260)"}
              opacity="0.2"
            />
          </svg>

          <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text — no fade-in-up here to avoid opacity:0 re-trigger on mode switch */}
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{
                  background: isDark
                    ? "oklch(0.28 0.08 270 / 0.5)"
                    : "oklch(1 0 0 / 0.5)",
                  color: isDark
                    ? "oklch(0.85 0.12 285)"
                    : "oklch(0.40 0.10 250)",
                  border: isDark
                    ? "1px solid oklch(0.45 0.12 275 / 0.5)"
                    : "none",
                }}
              >
                For anxiety · panic attacks · ADHD
              </span>

              {/* Hero headline */}
              <h1
                className="font-display mb-6 leading-tight"
                style={{
                  fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)",
                  fontStyle: "italic",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: isDark
                      ? "oklch(0.92 0.06 265)"
                      : "oklch(0.28 0.04 250)",
                    fontWeight: 600,
                    fontStyle: "normal",
                    marginBottom: "0.1em",
                  }}
                >
                  You&apos;re Safe,
                </span>
                <span
                  className="wind-float"
                  style={{
                    color: isDark
                      ? "oklch(0.88 0.18 295)"
                      : "oklch(0.38 0.22 275)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    display: "inline-block",
                  }}
                >
                  Just Breathe
                </span>
              </h1>

              <p
                className="text-lg mb-8 leading-relaxed max-w-md"
                style={{
                  color: isDark
                    ? "oklch(0.80 0.04 265)"
                    : "oklch(0.30 0.02 250)",
                }}
              >
                Science-backed breathing exercises, grounding techniques, and
                ADHD focus resets. No login. No noise. Just calm — right now.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo("exercises")}
                  className="btn-calm text-base px-8 py-3.5"
                  data-ocid="hero.primary_button"
                >
                  Start Breathing
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("grounding")}
                  className="px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    background: isDark
                      ? "oklch(0.28 0.08 270 / 0.5)"
                      : "oklch(1 0 0 / 0.5)",
                    color: isDark
                      ? "oklch(0.85 0.10 285)"
                      : "oklch(0.30 0.02 250)",
                    border: isDark
                      ? "1px solid oklch(0.48 0.12 275 / 0.6)"
                      : "1px solid oklch(1 0 0 / 0.6)",
                  }}
                  data-ocid="hero.secondary_button"
                >
                  Try Grounding
                </button>
              </div>
            </div>

            {/* Right: Breathing Widget */}
            <div className="breathing-scroll-target flex justify-center fade-in-up delay-200">
              <div
                className="p-8 rounded-3xl"
                style={{
                  background: isDark
                    ? "oklch(0.20 0.07 265 / 0.55)"
                    : "oklch(1 0 0 / 0.45)",
                  backdropFilter: "blur(20px)",
                  border: isDark
                    ? "1px solid oklch(0.35 0.10 270 / 0.4)"
                    : "1px solid oklch(1 0 0 / 0.5)",
                }}
              >
                <BreathingWidget isDark={isDark} />
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 60"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: "block" }}
              aria-hidden="true"
              role="presentation"
            >
              <title>Wave divider</title>
              <path
                d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
                fill={isDark ? "oklch(0.15 0.04 265)" : "oklch(0.98 0.008 220)"}
              />
            </svg>
          </div>
        </section>

        {/* Feature Cards */}
        <section
          id="exercises"
          className="py-20 px-4 section-light"
          style={{
            background: isDark
              ? "oklch(0.17 0.05 265)"
              : "oklch(0.98 0.008 220)",
            transition: "background-color 0.4s ease",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-in-up">
              <h2
                className="font-display font-bold text-4xl mb-4"
                style={{
                  color: isDark
                    ? "oklch(0.92 0.04 265)"
                    : "oklch(0.18 0.02 250)",
                }}
              >
                Simple Tools for Peace
              </h2>
              <p
                className="text-lg max-w-xl mx-auto"
                style={{
                  color: isDark
                    ? "oklch(0.75 0.04 265)"
                    : "oklch(0.42 0.02 250)",
                }}
              >
                Three exercises. Thirty seconds each. Designed for the moments
                you need it most.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURE_CARDS.map((card, i) => (
                <div
                  key={card.title}
                  className={`card-calm p-8 fade-in-up delay-${(i + 1) * 100}`}
                  style={{ background: isDark ? card.darkColor : card.color }}
                  data-ocid="exercises.card"
                >
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <h3
                    className="font-display font-bold text-xl mb-3"
                    style={{
                      color: isDark
                        ? "oklch(0.92 0.04 265)"
                        : "oklch(0.18 0.02 250)",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-base mb-6 leading-relaxed"
                    style={{
                      color: isDark
                        ? "oklch(0.78 0.04 265)"
                        : "oklch(0.38 0.02 250)",
                    }}
                  >
                    {card.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollTo(card.targetId)}
                    className="btn-calm text-sm px-6 py-2.5 inline-block"
                    style={{
                      background: isDark ? card.darkAccent : card.accent,
                    }}
                    data-ocid="exercises.primary_button"
                  >
                    {card.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grounding */}
        <GroundingSection isDark={isDark} />

        {/* ADHD Focus */}
        <ADHDFocusSection isDark={isDark} />

        {/* Quick Calm */}
        <QuickCalmSection isDark={isDark} />
      </main>

      <SoundPanel isDark={isDark} />

      {/* Footer */}
      <footer
        className="py-12 px-6"
        style={{
          background: isDark
            ? "linear-gradient(135deg, oklch(0.18 0.07 265) 0%, oklch(0.16 0.10 290) 100%)"
            : "linear-gradient(135deg, oklch(0.90 0.06 215) 0%, oklch(0.82 0.09 285) 100%)",
          transition: "background 0.5s ease",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span
                className="font-display font-bold text-xl"
                style={{
                  color: isDark
                    ? "oklch(0.85 0.10 285)"
                    : "oklch(0.22 0.05 260)",
                }}
              >
                CalmIn30
              </span>
            </div>
            <p
              className="text-sm italic"
              style={{
                color: isDark ? "oklch(0.72 0.08 270)" : "oklch(0.32 0.05 260)",
              }}
            >
              You are one breath away from calm.
            </p>
          </div>
          <div className="flex gap-6">
            {(["grounding", "adhd", "calm"] as const).map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="text-sm hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer p-0"
                style={{
                  color: isDark
                    ? "oklch(0.72 0.08 270)"
                    : "oklch(0.32 0.05 260)",
                }}
                data-ocid="footer.link"
              >
                {["Grounding", "Reset", "Body Scan"][i]}
              </button>
            ))}
          </div>
          <p
            className="text-xs text-center"
            style={{
              color: isDark ? "oklch(0.62 0.06 270)" : "oklch(0.38 0.05 260)",
            }}
          >
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
