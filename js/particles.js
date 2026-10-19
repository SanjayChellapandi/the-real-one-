/**
 * particles.js — Background floating particles for opening screen
 * and confetti / burst effects used throughout the site.
 */

'use strict';

// ─── Opening screen bg particles ──────────────────
function initOpeningParticles() {
  const container = document.getElementById('bg-particles');
  const decor     = document.getElementById('float-decor');
  if (!container || !decor) return;

  const EMOJIS = ['💗','🌸','⭐','🐾','💕','✨','🌟','💫','🩷','🌺'];
  const COUNT  = reducedMotion() ? 8 : 22;

  for (let i = 0; i < COUNT; i++) {
    const isHeart = R.bool(0.35);
    const isStar  = R.bool(0.25);
    const isPaw   = R.bool(0.2);

    const emoji = isHeart ? R.pick(['💗','💕','🩷','❤️‍🔥'])
                : isStar  ? R.pick(['⭐','✨','💫','🌟'])
                : isPaw   ? '🐾'
                : R.pick(EMOJIS);

    const cls = isHeart ? 'float-heart' : isStar ? 'float-star' : 'float-paw';

    const div = document.createElement('div');
    div.className = cls;
    div.textContent = emoji;
    div.style.cssText = [
      `left:${R.range(2, 95)}%`,
      `bottom:${R.range(-5, 15)}%`,
      `--size:${R.range(0.8, 2)}rem`,
      `--dur:${R.range(5, 12)}s`,
      `--delay:${R.range(0, 8)}s`,
      `--drift:${R.range(-50, 50)}px`,
      `--rot:${R.range(-30, 30)}deg`,
      `--rot2:${R.range(-180, 180)}deg`,
    ].join(';');

    container.appendChild(div);
  }
}

// ─── Confetti on paradise screen ──────────────────
function initConfetti() {
  const layer = document.getElementById('confetti-layer');
  if (!layer) return;

  const COLORS = ['#f06292','#ce93d8','#ff9eb5','#ffe066','#a5d6a7','#81d4fa','#ffcc80'];
  const COUNT  = reducedMotion() ? 6 : 18;

  for (let i = 0; i < COUNT; i++) {
    const div = document.createElement('div');
    div.className = 'confetti-piece';
    const w = R.range(6, 14);
    const h = R.range(8, 18);
    div.style.cssText = [
      `left:${R.range(0, 100)}%`,
      `top:-20px`,
      `--w:${w}px`,
      `--h:${h}px`,
      `width:${w}px`,
      `height:${h}px`,
      `--clr:${R.pick(COLORS)}`,
      `background:${R.pick(COLORS)}`,
      `--dur:${R.range(3, 7)}s`,
      `--delay:${R.range(0, 6)}s`,
      `--drift:${R.range(-80, 80)}px`,
      `--spin:${R.int(3,8) * 90}deg`,
      `border-radius:${R.bool() ? '50%' : '2px'}`,
    ].join(';');
    layer.appendChild(div);
  }
}

// ─── Sky stars & clouds for paradise ──────────────
function initSky() {
  const starContainer  = document.getElementById('sky-stars');
  const cloudContainer = document.getElementById('sky-clouds');
  if (!starContainer) return;

  // Stars
  const starCount = reducedMotion() ? 15 : 40;
  for (let i = 0; i < starCount; i++) {
    const s = document.createElement('div');
    s.className = 'sky-star';
    const size = R.range(2, 5);
    s.style.cssText = [
      `left:${R.range(0, 100)}%`,
      `top:${R.range(0, 100)}%`,
      `--s:${size}px`,
      `width:${size}px`,
      `height:${size}px`,
      `--dur:${R.range(1.5, 4)}s`,
      `--delay:${R.range(0, 4)}s`,
    ].join(';');
    starContainer.appendChild(s);
  }

  // Clouds
  if (!cloudContainer) return;
  const cloudCount = reducedMotion() ? 2 : 5;
  for (let i = 0; i < cloudCount; i++) {
    const c = document.createElement('div');
    c.className = 'sky-cloud';
    const w = R.range(80, 180);
    const h = R.range(25, 50);
    c.style.cssText = [
      `width:${w}px`,
      `height:${h}px`,
      `top:${R.range(5, 35)}%`,
      `--dur:${R.range(20, 40)}s`,
      `--delay:-${R.range(0, 20)}s`,
      `opacity:${R.range(0.4, 0.75)}`,
    ].join(';');
    cloudContainer.appendChild(c);
  }
}

// ─── Heart burst on smile button ──────────────────
function burstHearts(cx, cy) {
  const layer = document.getElementById('burst-layer');
  if (!layer) return;

  const count = reducedMotion() ? 6 : 20;
  const HEARTS = ['💗','💕','🩷','❤️','💖','💝','💓'];

  for (let i = 0; i < count; i++) {
    const angle  = (i / count) * 2 * Math.PI;
    const dist   = R.range(60, 160);
    const tx     = Math.cos(angle) * dist;
    const ty     = Math.sin(angle) * dist - R.range(40, 80);

    const div = document.createElement('div');
    div.className = 'burst-heart';
    div.textContent = R.pick(HEARTS);
    div.style.cssText = [
      `left:${cx}px`,
      `top:${cy}px`,
      `--tx:${tx}px`,
      `--ty:${ty}px`,
      `--dur:${R.range(0.9, 1.6)}s`,
      `--size:${R.range(1.2, 2.2)}rem`,
      `--rot:${R.range(-60, 60)}deg`,
    ].join(';');
    layer.appendChild(div);
    setTimeout(() => div.remove(), 2000);
  }

  // Dancing kittens
  const kCount = reducedMotion() ? 3 : 8;
  const KITTENS = ['🐱','😸','😺','😻','🐈'];
  for (let i = 0; i < kCount; i++) {
    const angle = (i / kCount) * 2 * Math.PI;
    const dist  = R.range(80, 180);
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist - R.range(60, 100);

    const div = document.createElement('div');
    div.className = 'burst-kitten';
    div.textContent = R.pick(KITTENS);
    div.style.cssText = [
      `left:${cx}px`,
      `top:${cy}px`,
      `--tx:${tx}px`,
      `--ty:${ty}px`,
      `--tx2:${tx * 1.4}px`,
      `--ty2:${ty * 1.4 - 40}px`,
      `--dur:${R.range(1.2, 2)}s`,
      `--size:${R.range(1.5, 2.8)}rem`,
    ].join(';');
    layer.appendChild(div);
    setTimeout(() => div.remove(), 2500);
  }
}

// ─── Sparkle burst on gift open ───────────────────
function burstGiftSparkles() {
  const container = document.getElementById('gift-sparkles');
  if (!container) return;

  const COLORS = ['#ffe066','#ff9eb5','#ce93d8','#ffffff','#f06292','#81d4fa'];
  const count  = reducedMotion() ? 10 : 30;

  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'gift-spark';
    const angle = (i / count) * 2 * Math.PI;
    const dist  = R.range(30, 100);
    div.style.cssText = [
      `left:50%`,
      `top:50%`,
      `--clr:${R.pick(COLORS)}`,
      `background:${R.pick(COLORS)}`,
      `--tx:${Math.cos(angle) * dist}px`,
      `--ty:${Math.sin(angle) * dist}px`,
      `--dur:${R.range(0.6, 1.2)}s`,
      `width:${R.range(4, 10)}px`,
      `height:${R.range(4, 10)}px`,
    ].join(';');
    container.appendChild(div);
    setTimeout(() => div.remove(), 1500);
  }
}

// ─── Spawning paw prints ──────────────────────────
function spawnPawPrint(x, y, container) {
  const div = document.createElement('div');
  div.className = 'paw-print';
  div.textContent = '🐾';
  div.style.cssText = [
    `left:${x}px`,
    `top:${y}px`,
    `--s:${R.range(1, 1.8)}rem`,
    `font-size:${R.range(0.9, 1.6)}rem`,
  ].join(';');
  container.appendChild(div);
  setTimeout(() => div.remove(), 4500);
}

// Expose
window.initOpeningParticles = initOpeningParticles;
window.initConfetti         = initConfetti;
window.initSky              = initSky;
window.burstHearts          = burstHearts;
window.burstGiftSparkles    = burstGiftSparkles;
window.spawnPawPrint        = spawnPawPrint;
