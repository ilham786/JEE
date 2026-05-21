"use client";

import { useEffect, useRef } from "react";
import { useStudyStore, AmbientSound } from "@/store/use-study-store";

export function SoundPlayer() {
  const { ambientSound, volume } = useStudyStore();
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Node references for rain / noise synthesis
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Nodes for synth pad (lofi)
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const synthGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      stopAllSounds();
    };
  }, []);

  // Update volume when store changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
    if (synthGainRef.current) {
      synthGainRef.current.gain.value = volume * 0.4; // keep synth slightly softer
    }
  }, [volume]);

  // Restart sound when sound type changes
  useEffect(() => {
    stopAllSounds();
    if (ambientSound !== "none") {
      startSound(ambientSound);
    }
  }, [ambientSound]);

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const startSound = (type: AmbientSound) => {
    try {
      const ctx = initAudioContext();
      
      // Main gain node for volume control
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.value = volume;
      gainNodeRef.current.connect(ctx.destination);

      if (type === "white-noise") {
        playWhiteNoise(ctx);
      } else if (type === "rain") {
        playRainNoise(ctx);
      } else if (type === "lofi") {
        playLofiDrone(ctx);
      }
    } catch (e) {
      console.warn("Failed to initialize Web Audio context (likely needs user interaction):", e);
    }
  };

  const stopAllSounds = () => {
    // Stop noise source
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch (e) {}
      noiseSourceRef.current.disconnect();
      noiseSourceRef.current = null;
    }
    
    // Stop oscillators
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
      osc.disconnect();
    });
    oscillatorsRef.current = [];

    if (synthGainRef.current) {
      synthGainRef.current.disconnect();
      synthGainRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const playWhiteNoise = (ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    // Filter to make it less harsh
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1000; // soft rumble
    
    whiteNoise.connect(filter);
    if (gainNodeRef.current) {
      filter.connect(gainNodeRef.current);
    }
    
    whiteNoise.start();
    noiseSourceRef.current = whiteNoise;
  };

  const playRainNoise = (ctx: AudioContext) => {
    // Generate pinkish/brown noise buffer for natural rain rumble
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise formula: filter white noise to accumulate output
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // amplify slightly
    }

    const rainNoise = ctx.createBufferSource();
    rainNoise.buffer = noiseBuffer;
    rainNoise.loop = true;

    // Bandpass filter to model rain drops hitting ground
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "peaking";
    bandpass.frequency.value = 400;
    bandpass.Q.value = 1.0;
    bandpass.gain.value = 3;

    // High cut filter
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = "lowpass";
    lpFilter.frequency.value = 1200;

    rainNoise.connect(bandpass);
    bandpass.connect(lpFilter);
    
    if (gainNodeRef.current) {
      lpFilter.connect(gainNodeRef.current);
    }

    rainNoise.start();
    noiseSourceRef.current = rainNoise;
  };

  const playLofiDrone = (ctx: AudioContext) => {
    // Create a smooth minor triad chord drone: A minor or C major
    // Frequencies: A2 (110Hz), C3 (130.81Hz), E3 (164.81Hz), A3 (220Hz)
    const baseFreqs = [110, 130.81, 164.81, 220];
    
    synthGainRef.current = ctx.createGain();
    synthGainRef.current.gain.value = volume * 0.4;
    
    if (gainNodeRef.current) {
      synthGainRef.current.connect(gainNodeRef.current);
    } else {
      synthGainRef.current.connect(ctx.destination);
    }

    baseFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      // triangle wave gives a warm, flute-like tone
      osc.type = "triangle";
      osc.frequency.value = freq;

      // Low frequency oscillator (LFO) to modulate amplitude for a lofi swelling effect
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15; // slow swelling every ~7 seconds
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.15; // modulate slightly

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.2; // individual osc volume

      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      if (synthGainRef.current) {
        oscGain.connect(synthGainRef.current);
      }

      lfo.start();
      osc.start();
      
      oscillatorsRef.current.push(osc);
      oscillatorsRef.current.push(lfo); // store to stop later
    });
  };

  return null; // Silent component
}
