import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RainSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    source1?: AudioBufferSourceNode;
    source2?: AudioBufferSourceNode;
    gain?: GainNode;
  }>({});

  function createRainAudio(ctx: AudioContext) {
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

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    masterGain.connect(ctx.destination);

    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);

    source1.start();
    source2.start();

    nodesRef.current = { source1, source2, gain: masterGain };
  }

  const stopRain = useCallback(() => {
    const { source1, source2, gain } = nodesRef.current;
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (gain) {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
    }
    setTimeout(() => {
      try {
        source1?.stop();
        source2?.stop();
      } catch (_) {
        // already stopped
      }
      nodesRef.current = {};
    }, 1100);
  }, []);

  function toggle() {
    if (isPlaying) {
      stopRain();
      setIsPlaying(false);
    } else {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      createRainAudio(ctx);
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    return () => {
      stopRain();
      audioCtxRef.current?.close();
    };
  }, [stopRain]);

  return (
    <div
      className="fixed bottom-28 right-6 z-50 flex flex-col items-center gap-2"
      data-ocid="rain.button"
    >
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "oklch(0.72 0.08 230 / 0.15)",
              color: "oklch(0.42 0.10 230)",
              border: "1px solid oklch(0.72 0.08 230 / 0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            🎵 rain on
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {isPlaying &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: "2px solid oklch(0.72 0.08 230 / 0.4)",
                }}
                initial={{ scale: 1, opacity: 0.6 }}
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
          onClick={toggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          title={isPlaying ? "Stop rain sound" : "Play rain sound"}
          aria-label={isPlaying ? "Stop rain sound" : "Play rain sound"}
          aria-pressed={isPlaying}
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-shadow"
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, oklch(0.65 0.12 225), oklch(0.62 0.16 290))"
              : "oklch(0.98 0.008 220)",
            border: isPlaying
              ? "2px solid oklch(0.72 0.10 225 / 0.5)"
              : "2px solid oklch(0.88 0.06 220)",
            boxShadow: isPlaying
              ? "0 4px 24px oklch(0.65 0.12 225 / 0.45)"
              : "0 2px 12px oklch(0.18 0.02 250 / 0.12)",
          }}
        >
          <span
            style={{
              filter: isPlaying ? "brightness(1.3)" : "none",
              transition: "filter 0.3s",
            }}
          >
            🌧️
          </span>
        </motion.button>
      </div>
    </div>
  );
}
