import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type SoundType = "rain" | "om" | "crickets" | null;

interface SoundOption {
  id: SoundType;
  label: string;
  emoji: string;
  darkHint?: boolean;
}

const SOUND_OPTIONS: SoundOption[] = [
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "om", label: "Om Chanting", emoji: "🕉️", darkHint: true },
  { id: "crickets", label: "Night Crickets", emoji: "🦗", darkHint: true },
];

type AudioNodes = {
  sources?: AudioNode[];
  masterGain?: GainNode;
  cleanup?: () => void;
};

function createRainAudio(ctx: AudioContext, masterGain: GainNode) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source1 = ctx.createBufferSource();
  source1.buffer = buffer;
  source1.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 800;
  lowpass.Q.value = 0.5;

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 100;

  const gain1 = ctx.createGain();
  gain1.gain.value = 0.28;

  source1.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(gain1);

  const source2 = ctx.createBufferSource();
  source2.buffer = buffer;
  source2.loop = true;
  source2.loopStart = 0.5;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 2000;
  bandpass.Q.value = 0.8;

  const gain2 = ctx.createGain();
  gain2.gain.value = 0.1;

  source2.connect(bandpass);
  bandpass.connect(gain2);

  gain1.connect(masterGain);
  gain2.connect(masterGain);

  source1.start();
  source2.start();

  return {
    cleanup: () => {
      try {
        source1.stop();
      } catch (_) {
        /* already stopped */
      }
      try {
        source2.stop();
      } catch (_) {
        /* already stopped */
      }
    },
  };
}

function createOmAudio(ctx: AudioContext, masterGain: GainNode) {
  // Deep male fundamental: 85Hz (low baritone)
  const fundamental = 85;

  // Create multiple harmonic partials to simulate vocal timbre
  const harmonics = [
    { ratio: 1, gain: 0.55, type: "sine" as OscillatorType },
    { ratio: 2, gain: 0.22, type: "sine" as OscillatorType },
    { ratio: 3, gain: 0.14, type: "sine" as OscillatorType },
    { ratio: 4, gain: 0.07, type: "sine" as OscillatorType },
    { ratio: 5, gain: 0.04, type: "sine" as OscillatorType },
  ];

  const oscillators: OscillatorNode[] = [];
  const gainNodes: GainNode[] = [];

  for (const h of harmonics) {
    const osc = ctx.createOscillator();
    osc.type = h.type;
    osc.frequency.value = fundamental * h.ratio;
    // Slight detune for warmth
    osc.detune.value = (Math.random() - 0.5) * 6;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(h.gain, ctx.currentTime + 4);

    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    oscillators.push(osc);
    gainNodes.push(g);
  }

  // Formant filter 1 — "O" vowel low formant ~500Hz
  const formant1 = ctx.createBiquadFilter();
  formant1.type = "peaking";
  formant1.frequency.value = 500;
  formant1.Q.value = 3;
  formant1.gain.value = 8;

  // Formant filter 2 — "O" vowel high formant ~1000Hz
  const formant2 = ctx.createBiquadFilter();
  formant2.type = "peaking";
  formant2.frequency.value = 1000;
  formant2.Q.value = 4;
  formant2.gain.value = 5;

  // Route oscillators through formant chain for vocal coloring
  const formantGain = ctx.createGain();
  formantGain.gain.value = 0.4;
  for (const g of gainNodes) {
    g.connect(formant1);
  }
  formant1.connect(formant2);
  formant2.connect(formantGain);
  formantGain.connect(masterGain);

  // Slow breath swell LFO (0.04 Hz = one breath every 25s, very slow)
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.04;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.08;
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();

  // Subtle reverb-like delay for spaciousness
  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = 0.45;
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.value = 0.25;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.18;
  masterGain.connect(delay);
  delay.connect(delayFeedback);
  delayFeedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(ctx.destination);

  // Soft overall master
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 4);

  return {
    cleanup: () => {
      for (const osc of oscillators) {
        try {
          osc.stop();
        } catch (_) {
          /* already stopped */
        }
      }
      try {
        lfo.stop();
      } catch (_) {
        /* already stopped */
      }
    },
  };
}

function createCricketsAudio(ctx: AudioContext, masterGain: GainNode) {
  let stopped = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];
  const activeOscs: OscillatorNode[] = [];

  // Crickets chirp at ~4500-5200Hz with rapid amplitude modulation
  // Real cricket: ~3-4 pulses per chirp, each pulse ~15ms, chirp rate ~2-4 per second
  function makeChirp(freq: number, startDelay: number, numPulses: number) {
    const t = setTimeout(() => {
      if (stopped) return;
      for (let p = 0; p < numPulses; p++) {
        const pulseDelay = p * 18; // ~18ms between pulses
        const pt = setTimeout(() => {
          if (stopped) return;
          const carrier = ctx.createOscillator();
          carrier.type = "sine";
          carrier.frequency.value = freq;

          // Amplitude modulator for the pulse "tick"
          const modOsc = ctx.createOscillator();
          modOsc.type = "square";
          modOsc.frequency.value = 180; // rapid flutter inside each pulse

          const modGain = ctx.createGain();
          modGain.gain.value = 0.5;
          modOsc.connect(modGain);

          const pulseGain = ctx.createGain();
          pulseGain.gain.setValueAtTime(0, ctx.currentTime);
          pulseGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.003);
          pulseGain.gain.setValueAtTime(0.35, ctx.currentTime + 0.01);
          pulseGain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.022,
          );

          // High-pass to keep it crispy
          const hp = ctx.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.value = 3500;

          carrier.connect(hp);
          hp.connect(pulseGain);
          pulseGain.connect(masterGain);

          carrier.start();
          modOsc.start();
          carrier.stop(ctx.currentTime + 0.025);
          modOsc.stop(ctx.currentTime + 0.025);
          activeOscs.push(carrier, modOsc);
        }, pulseDelay);
        timeouts.push(pt);
      }
    }, startDelay);
    timeouts.push(t);
  }

  // Schedule a colony of crickets with slightly different frequencies and rhythms
  function scheduleColony() {
    if (stopped) return;

    // 3-5 crickets in the colony
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const freq = 4400 + Math.random() * 900; // 4400–5300Hz
      const offset = Math.random() * 400; // staggered start within 400ms
      const pulses = 3 + Math.floor(Math.random() * 2); // 3–4 pulses
      makeChirp(freq, offset, pulses);
    }

    // Next colony after 500–1200ms
    const nextDelay = 500 + Math.random() * 700;
    const nt = setTimeout(scheduleColony, nextDelay);
    timeouts.push(nt);
  }

  // Soft background hiss (very quiet high-freq noise for ambience)
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noiseBuffer.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 6000;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.018;
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseSource.start();

  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.5);

  scheduleColony();

  return {
    cleanup: () => {
      stopped = true;
      for (const t of timeouts) clearTimeout(t);
      try {
        noiseSource.stop();
      } catch (_) {
        /* already stopped */
      }
      for (const osc of activeOscs) {
        try {
          osc.stop();
        } catch (_) {
          /* already stopped */
        }
      }
    },
  };
}

interface SoundPanelProps {
  isDark?: boolean;
}

export default function SoundPanel({ isDark }: SoundPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSound, setActiveSound] = useState<SoundType>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNodes>({});
  const panelRef = useRef<HTMLDivElement>(null);

  const stopCurrentSound = useCallback((fadeOut = true): Promise<void> => {
    return new Promise((resolve) => {
      const { masterGain, cleanup } = nodesRef.current;
      const ctx = audioCtxRef.current;
      if (!ctx || !masterGain) {
        cleanup?.();
        nodesRef.current = {};
        resolve();
        return;
      }
      if (fadeOut) {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        setTimeout(() => {
          cleanup?.();
          nodesRef.current = {};
          resolve();
        }, 900);
      } else {
        cleanup?.();
        nodesRef.current = {};
        resolve();
      }
    });
  }, []);

  const playSound = useCallback(
    async (soundId: SoundType) => {
      if (!soundId) return;

      // Stop current
      if (nodesRef.current.masterGain) {
        await stopCurrentSound(true);
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);

      let result: { cleanup: () => void };

      switch (soundId) {
        case "rain":
          result = createRainAudio(ctx, masterGain);
          break;
        case "om":
          result = createOmAudio(ctx, masterGain);
          break;
        case "crickets":
          result = createCricketsAudio(ctx, masterGain);
          break;
        default:
          return;
      }

      nodesRef.current = { masterGain, cleanup: result.cleanup };
    },
    [stopCurrentSound],
  );

  const handleToggleSound = useCallback(
    async (soundId: SoundType) => {
      if (activeSound === soundId) {
        // Turn off
        await stopCurrentSound(true);
        setActiveSound(null);
      } else {
        setActiveSound(soundId);
        await playSound(soundId);
      }
    },
    [activeSound, playSound, stopCurrentSound],
  );

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentSound(false);
      audioCtxRef.current?.close();
    };
  }, [stopCurrentSound]);

  const isDarkMode =
    isDark ?? document.documentElement.classList.contains("dark");

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-ocid="sound.panel"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col gap-2 p-3 rounded-2xl"
            style={{
              background: isDarkMode
                ? "oklch(0.22 0.05 265 / 0.95)"
                : "oklch(1 0 0 / 0.95)",
              backdropFilter: "blur(20px)",
              border: isDarkMode
                ? "1px solid oklch(0.35 0.08 270 / 0.6)"
                : "1px solid oklch(0.88 0.04 220)",
              boxShadow: isDarkMode
                ? "0 8px 32px oklch(0.08 0.04 265 / 0.6)"
                : "0 8px 32px oklch(0.18 0.02 250 / 0.15)",
              minWidth: "180px",
            }}
          >
            {/* Dark mode hint label */}
            {isDarkMode && (
              <p
                className="text-xs px-2 pb-1 font-medium"
                style={{ color: "oklch(0.65 0.10 285)" }}
              >
                ✨ Night mode suggested
              </p>
            )}

            {SOUND_OPTIONS.map((option) => {
              const isActive = activeSound === option.id;
              const isDarkSuggested = isDarkMode && option.darkHint;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleToggleSound(option.id)}
                  data-ocid={`sound.${option.id}.toggle`}
                  aria-pressed={isActive}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: isActive
                      ? isDarkMode
                        ? "oklch(0.55 0.14 285 / 0.35)"
                        : "oklch(0.88 0.08 230 / 0.5)"
                      : isDarkSuggested && !isActive
                        ? isDarkMode
                          ? "oklch(0.28 0.08 270 / 0.4)"
                          : "transparent"
                        : "transparent",
                    border: isActive
                      ? `1px solid ${
                          isDarkMode
                            ? "oklch(0.65 0.14 285 / 0.6)"
                            : "oklch(0.72 0.10 230 / 0.5)"
                        }`
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? isDarkMode
                        ? "0 0 12px oklch(0.65 0.14 285 / 0.3)"
                        : "0 0 12px oklch(0.72 0.10 230 / 0.25)"
                      : undefined,
                  }}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isActive
                        ? isDarkMode
                          ? "oklch(0.88 0.12 285)"
                          : "oklch(0.38 0.12 230)"
                        : isDarkMode
                          ? "oklch(0.78 0.04 265)"
                          : "oklch(0.38 0.02 250)",
                    }}
                  >
                    {option.label}
                    {isDarkSuggested && (
                      <span
                        className="ml-1.5 text-xs opacity-60"
                        style={{
                          color: isDarkMode
                            ? "oklch(0.70 0.12 285)"
                            : "oklch(0.55 0.10 285)",
                        }}
                      >
                        ✦
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-xs"
                      style={{
                        color: isDarkMode
                          ? "oklch(0.78 0.14 285)"
                          : "oklch(0.55 0.12 230)",
                      }}
                    >
                      ♪
                    </motion.span>
                  )}
                </motion.button>
              );
            })}

            {activeSound && (
              <button
                type="button"
                onClick={() => handleToggleSound(activeSound)}
                data-ocid="sound.stop_button"
                className="mt-1 text-xs text-center py-1.5 rounded-lg transition-all"
                style={{
                  color: isDarkMode
                    ? "oklch(0.58 0.08 265)"
                    : "oklch(0.52 0.04 250)",
                  background: isDarkMode
                    ? "oklch(0.28 0.04 265 / 0.5)"
                    : "oklch(0.94 0.02 220)",
                }}
              >
                Stop all sounds
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <div className="relative">
        <AnimatePresence>
          {activeSound &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: `2px solid ${
                    isDarkMode
                      ? "oklch(0.65 0.14 285 / 0.4)"
                      : "oklch(0.72 0.08 230 / 0.4)"
                  }`,
                }}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 2.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.7,
                  ease: "easeOut",
                }}
              />
            ))}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen((o) => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          title="Sound options"
          aria-label="Toggle sound panel"
          aria-pressed={isOpen}
          data-ocid="sound.open_modal_button"
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg transition-shadow"
          style={{
            background: activeSound
              ? isDarkMode
                ? "linear-gradient(135deg, oklch(0.45 0.14 265), oklch(0.52 0.18 290))"
                : "linear-gradient(135deg, oklch(0.65 0.12 225), oklch(0.62 0.16 290))"
              : isDarkMode
                ? "oklch(0.22 0.06 265)"
                : "oklch(0.98 0.008 220)",
            border: activeSound
              ? isDarkMode
                ? "2px solid oklch(0.55 0.14 285 / 0.6)"
                : "2px solid oklch(0.72 0.10 225 / 0.5)"
              : isDarkMode
                ? "2px solid oklch(0.32 0.06 270)"
                : "2px solid oklch(0.88 0.06 220)",
            boxShadow: activeSound
              ? isDarkMode
                ? "0 4px 24px oklch(0.55 0.14 285 / 0.5)"
                : "0 4px 24px oklch(0.65 0.12 225 / 0.45)"
              : isDarkMode
                ? "0 2px 12px oklch(0.08 0.04 265 / 0.5)"
                : "0 2px 12px oklch(0.18 0.02 250 / 0.12)",
          }}
        >
          <span className="select-none">
            {activeSound
              ? (SOUND_OPTIONS.find((o) => o.id === activeSound)?.emoji ?? "🎵")
              : "🎵"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
