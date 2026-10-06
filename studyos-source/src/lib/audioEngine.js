/**
 * ADHD Ambient Audio Engine
 * Uses the Web Audio API to synthesize low-frequency noise (Brown Noise, Rain, 40Hz Gamma).
 * No external audio files or network requests needed.
 */

let audioCtx = null;
let currentSource = null;
let gainNode = null;
let activeType = null; // 'brown' | 'rain' | 'gamma' | null

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch {
      // ignore
    }
    currentSource = null;
  }
  activeType = null;
}

export function getActiveAudioType() {
  return activeType;
}

/**
 * Brown Noise: Deep, soft roaring noise that blocks distractions without irritating ears.
 */
export function playBrownNoise(volume = 0.25) {
  stopAudio();
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5; // Gain compensation
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = buffer;
  whiteNoise.loop = true;

  gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);

  whiteNoise.connect(gainNode);
  gainNode.connect(ctx.destination);

  whiteNoise.start();
  currentSource = whiteNoise;
  activeType = 'brown';
}

/**
 * Rain Noise: Pink noise with soft low-pass filter
 */
export function playRainNoise(volume = 0.2) {
  stopAudio();
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);

  gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start();
  currentSource = noise;
  activeType = 'rain';
}

/**
 * 40Hz Gamma Focus Frequency:
 * 40Hz binaural/isochronic beat research indicates elevated cognitive clarity and reduced mind-wandering in ADHD individuals.
 */
export function playGammaPulse(volume = 0.15) {
  stopAudio();
  const ctx = getAudioContext();
  if (!ctx) return;

  const carrier = ctx.createOscillator();
  carrier.type = 'sine';
  carrier.frequency.setValueAtTime(196, ctx.currentTime); // G3 musical tone

  const modOsc = ctx.createOscillator();
  modOsc.type = 'sine';
  modOsc.frequency.setValueAtTime(40, ctx.currentTime); // 40Hz Gamma rhythm

  const modGain = ctx.createGain();
  modGain.gain.setValueAtTime(0.5, ctx.currentTime);

  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(volume, ctx.currentTime);

  modOsc.connect(modGain.gain);
  carrier.connect(mainGain);
  mainGain.connect(ctx.destination);

  carrier.start();
  modOsc.start();

  currentSource = {
    stop: () => {
      carrier.stop();
      modOsc.stop();
    },
    disconnect: () => {
      carrier.disconnect();
      modOsc.disconnect();
    },
  };
  activeType = 'gamma';
}

/**
 * Gentle 2-chord victory chime for dopamine reinforcement
 */
export function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.08;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

    osc.connect(g);
    g.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.85);
  });
}
