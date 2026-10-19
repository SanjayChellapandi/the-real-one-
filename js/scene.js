/**
 * scene.js — Special two-cat scene after the letter
 *
 * Two cats approach each other. Left cat offers a flower.
 * Dancing kittens appear around them.
 * Stars and hearts float in the night sky.
 */

'use strict';

function initSpecialScene() {
  _buildStars();
  _buildSceneHearts();
  _startCatsApproach();
}

// ─── Stars ─────────────────────────────────────────
function _buildStars() {
  const container = document.getElementById('scene-stars');
  if (!container) return;
  container.innerHTML = '';

  const count = reducedMotion() ? 20 : 60;
  const STAR_EMOJIS = ['✨','⭐','🌟','💫','★'];

  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'scene-star';
    const isEmoji = R.bool(0.3);
    if (isEmoji) {
      s.textContent = R.pick(STAR_EMOJIS);
      s.style.cssText = [
        `left:${R.range(0, 100)}%`,
        `top:${R.range(0, 85)}%`,
        `--s:${R.range(0.7, 1.6)}rem`,
        `font-size:${R.range(0.7, 1.4)}rem`,
        `--dur:${R.range(1.5, 4)}s`,
        `--delay:${R.range(0, 4)}s`,
      ].join(';');
    } else {
      // CSS dot star
      s.style.cssText = [
        `left:${R.range(0, 100)}%`,
        `top:${R.range(0, 85)}%`,
        `width:${R.range(2, 5)}px`,
        `height:${R.range(2, 5)}px`,
        `background:white`,
        `border-radius:50%`,
        `--dur:${R.range(1.5, 3.5)}s`,
        `--delay:${R.range(0, 3)}s`,
      ].join(';');
    }
    container.appendChild(s);
  }
}

// ─── Floating hearts ───────────────────────────────
function _buildSceneHearts() {
  const container = document.getElementById('scene-hearts');
  if (!container) return;
  container.innerHTML = '';

  const count = reducedMotion() ? 6 : 18;
  const HEARTS = ['💗','💕','🩷','❤️','💖','💝','💓'];

  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'scene-heart';
    h.textContent = R.pick(HEARTS);
    h.style.cssText = [
      `left:${R.range(5, 92)}%`,
      `bottom:${R.range(10, 50)}%`,
      `--s:${R.range(1, 2.2)}rem`,
      `font-size:${R.range(0.9, 2)}rem`,
      `--dur:${R.range(4, 8)}s`,
      `--delay:${R.range(0, 5)}s`,
    ].join(';');
    container.appendChild(h);
  }
}

// ─── Cats approach ─────────────────────────────────
function _startCatsApproach() {
  const leftCat  = document.getElementById('scene-cat-left');
  const rightCat = document.getElementById('scene-cat-right');
  if (!leftCat || !rightCat) return;

  // Trigger CSS transitions
  setTimeout(() => {
    leftCat.classList.add('approached-left');
    rightCat.classList.add('approached-right');
  }, 400);

  // After they meet, show dancing kittens
  setTimeout(_spawnDancingKittens, 2000);

  // Show message
  setTimeout(_showSceneMessage, 3200);
}

// ─── Dancing kittens around the scene ──────────────
function _spawnDancingKittens() {
  const container = document.getElementById('dance-kittens');
  if (!container) return;

  const KITTENS = ['🐱','😸','😺','😻','🐈','🐾'];
  const positions = [
    { left: '2%',  delay: '0s',    dur: '0.7s' },
    { left: '12%', delay: '0.2s',  dur: '0.9s' },
    { left: '78%', delay: '0.1s',  dur: '0.75s' },
    { left: '88%', delay: '0.35s', dur: '0.85s' },
    { left: '95%', delay: '0.15s', dur: '0.65s' },
  ];

  if (!reducedMotion()) {
    positions.forEach((pos) => {
      const k = document.createElement('div');
      k.className = 'dance-kitten';
      k.textContent = R.pick(KITTENS);
      k.style.cssText = [
        `left:${pos.left}`,
        `animation-delay:${pos.delay}`,
        `animation-duration:${pos.dur}`,
      ].join(';');
      container.appendChild(k);
    });
  }

  // Glow rings around the two cats
  _addGlowRings();
}

function _addGlowRings() {
  const stage = document.querySelector('.scene-stage');
  if (!stage || reducedMotion()) return;

  [60, 100, 150].forEach((size, i) => {
    const ring = document.createElement('div');
    ring.className = 'glow-ring';
    ring.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:50%`,
      `bottom:10px`,
      `margin-left:-${size / 2}px`,
      `animation-delay:${i * 0.4}s`,
    ].join(';');
    stage.appendChild(ring);
  });
}

// ─── Message reveal ────────────────────────────────
function _showSceneMessage() {
  const msg = document.getElementById('scene-message');
  if (!msg) return;
  msg.hidden = false;
  AudioManager.playSparkle();
}

// ─── Back button ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('scene-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      const scene    = document.getElementById('special-scene');
      const paradise = document.getElementById('paradise-screen');
      if (scene) {
        scene.hidden = true;
        scene.style.zIndex = '';
      }
      if (paradise) {
        paradise.style.zIndex = '';
        paradise.classList.add('active');
      }
    });
  }
});

window.initSpecialScene = initSpecialScene;
