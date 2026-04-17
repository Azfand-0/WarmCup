"use client";
import { useCallback, useRef, useState } from "react";

// Generates soft rain-like white noise using Web Audio API — no external files needed
export function useSound() {
  const [playing, setPlaying] = useState(false);
  const ctxRef    = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef   = useRef<GainNode | null>(null);

  const start = useCallback(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // 3-second looping white noise buffer
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    }

    // Low-pass + resonance to make it sound like distant rain
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 350;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gainRef.current = gain;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    sourceRef.current = source;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    // Fade in gently
    gain.gain.setTargetAtTime(0.12, ctx.currentTime, 1.2);
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (!gainRef.current || !ctxRef.current) return;
    gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.5);
    setTimeout(() => {
      sourceRef.current?.stop();
      ctxRef.current?.close();
      ctxRef.current = null;
      setPlaying(false);
    }, 1500);
  }, []);

  const toggle = useCallback(() => {
    playing ? stop() : start();
  }, [playing, start, stop]);

  return { playing, toggle };
}
