import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

// One sound at a time: starting a new sound fades the previous one out.
const loadingSources = {
  hollow: require("../../assets/sounds/hollow-loading.mp3"),
  silksong: require("../../assets/sounds/silksong-loading.mp3"),
};
// Every track in assets/sounds/Game Selector is bundled explicitly for Expo.
const selectorSources = [
  require("../../assets/sounds/Game Selector/selector1.mp3"),
  require("../../assets/sounds/Game Selector/selector2.mp3"),
  require("../../assets/sounds/Game Selector/selector3.mp3"),
  require("../../assets/sounds/Game Selector/selector4.mp3"),
  require("../../assets/sounds/Game Selector/selector5.mp3"),
  require("../../assets/sounds/Game Selector/selector6.mp3"),
  require("../../assets/sounds/Game Selector/selector7.mp3"),
  require("../../assets/sounds/Game Selector/selector8.mp3"),
  require("../../assets/sounds/Game Selector/selector9.mp3"),
  require("../../assets/sounds/Game Selector/selector10.mp3"),
  require("../../assets/sounds/Game Selector/selector11.mp3"),
];

const FADE_MS = 600;
const FADE_STEPS = 12;

let current = null;
let currentVolume = 0.8;
let latestRequest = 0;
let audioReady = null;

// Lets sound play even when the iPhone's silent switch is on (set once).
function prepareAudio() {
  audioReady ??= setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  return audioReady;
}

// Updates the sound that is already playing without restarting it.
export function setSoundVolume(volume) {
  currentVolume = Math.max(0, Math.min(1, volume));
  if (current) {
    try {
      current.volume = currentVolume;
    } catch {
      // The player may already be stopping.
    }
  }
}

function fadeOutAndRelease(player) {
  const startingVolume = player.volume;
  let step = 0;
  const timer = setInterval(() => {
    step += 1;
    try {
      if (step >= FADE_STEPS) {
        clearInterval(timer);
        player.pause();
        player.remove();
      } else {
        player.volume = startingVolume * (1 - step / FADE_STEPS);
      }
    } catch {
      clearInterval(timer);
    }
  }, FADE_MS / FADE_STEPS);
}

async function play(source) {
  const request = ++latestRequest;
  await prepareAudio();
  // A newer sound was requested while the audio mode was being set up.
  if (request !== latestRequest) return;

  if (current) {
    fadeOutAndRelease(current);
    current = null;
  }
  if (!source || currentVolume === 0) return;

  try {
    const player = createAudioPlayer(source);
    player.volume = currentVolume;
    player.play();
    current = player;
  } catch {
    // Sound is decoration; never let it break the app.
  }
}

// Fades out whatever is playing and cancels any sound still waiting to start.
export function stopSound() {
  latestRequest += 1;
  if (current) {
    fadeOutAndRelease(current);
    current = null;
  }
}

export function pickRandomGameId() {
  const ids = Object.keys(loadingSources);
  return ids[Math.floor(Math.random() * ids.length)];
}

export function playLoadingSound(gameId) {
  return play(loadingSources[gameId]);
}

export function playSelectorSound() {
  const source = selectorSources[Math.floor(Math.random() * selectorSources.length)];
  return play(source);
}
