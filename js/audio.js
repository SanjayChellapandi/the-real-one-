/**
 * audio.js — Background music & cat sound manager
 *
 * Background music uses the bundled song. Cat sounds and chimes
 * are generated with the Web Audio API.
 */

'use strict';

const AudioManager = (() => {
  let ctx = null;          // AudioContext
  let masterGain = null;
  let isPlaying = false;
  const music = new Audio('assets/Thiruchitrambalam%20Mp3%20Download.mp3');
  music.loop = true;
  music.preload = 'auto';

  music.addEventListener('play', () => {
    isPlaying = true;
    window.dispatchEvent(new Event('musicstatechange'));
  });
  music.addEventListener('pause', () => {
    isPlaying = false;
    window.dispatchEvent(new Event('musicstatechange'));
  });

  // ─── Init AudioContext ─────────────────────────
  function initCtx() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
    masterGain.connect(ctx.destination);
  }

  // ─── Cat sound ────────────────────────────────
  function playCatMeow() {
    try {
      if (!ctx) initCtx();
      const now = ctx.currentTime;
      // Short rising + falling frequency = "meow"
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.1);
      osc.frequency.linearRampToValueAtTime(450, now + 0.35);
      osc.frequency.linearRampToValueAtTime(300, now + 0.55);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.setValueAtTime(0.2, now + 0.4);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.connect(gain);
      gain.connect(masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch (_) { /* silence errors if audio ctx unavailable */ }
  }

  // ─── Sparkle chime ────────────────────────────
  function playSparkle() {
    try {
      if (!ctx) initCtx();
      const now = ctx.currentTime;
      [1046.5, 1318.5, 1567.98].forEach((f, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.04);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(masterGain || ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch (_) { /* silent */ }
  }

  // ─── Public API ───────────────────────────────
  function toggle() {
    if (isPlaying) {
      music.pause();
      return false;
    }
    playMusic();
    return true;
  }

  function playMusic() {
    const playback = music.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(() => {
        isPlaying = false;
        window.dispatchEvent(new Event('musicstatechange'));
      });
    }
    return true;
  }

  function getIsPlaying() { return isPlaying; }

  return { toggle, playMusic, getIsPlaying, playCatMeow, playSparkle };
})();

window.AudioManager = AudioManager;
