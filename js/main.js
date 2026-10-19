/**
 * main.js — Orchestrates the full experience
 *
 * Flow:
 *  1. Opening screen particles init
 *  2. Gift box open → transition → paradise
 *  3. Paradise: cats, sky, confetti init
 *  4. Smile button → heart burst
 *  5. More Kitties button → more cats
 *  6. Letter button → letter.js
 *  7. Music toggle → audio.js
 */

'use strict';

// ─── DOM references ────────────────────────────────
const openingScreen  = document.getElementById('opening-screen');
const paradiseScreen = document.getElementById('paradise-screen');
const giftBox        = document.getElementById('gift-box');
const giftLid        = document.getElementById('gift-lid');
const openGiftBtn    = document.getElementById('open-gift-btn');
const transitionEl   = document.getElementById('transition-overlay');
const jumpCatsEl     = document.getElementById('jump-cats');
const sparkBurstEl   = document.getElementById('sparkle-burst');
const btnSmile       = document.getElementById('btn-smile');
const btnMoreCats    = document.getElementById('btn-more-cats');
const musicToggle    = document.getElementById('music-toggle');
const musicIcon      = document.getElementById('music-icon');
const musicLabel     = document.getElementById('music-label');
const musicViz       = document.getElementById('music-viz');

// ─── Gift open transition ──────────────────────────
async function openGiftSequence() {
  openGiftBtn.disabled = true;
  openGiftBtn.style.pointerEvents = 'none';

  // 1. Lid opens
  giftLid.classList.add('opened');
  AudioManager.playSparkle();

  // 2. Gift sparkles
  burstGiftSparkles();

  await wait(500);

  // 3. Jump cats appear on overlay
  showJumpCats();

  // 4. Overlay fades in
  transitionEl.style.transition = 'opacity 0.4s ease';
  transitionEl.style.opacity = '1';
  transitionEl.style.pointerEvents = 'all';
  transitionEl.style.background = 'rgba(252,228,236,0.92)';

  await wait(1200);

  // 5. Switch screens
  openingScreen.classList.remove('active');
  paradiseScreen.classList.add('active');

  // 6. Fade out overlay
  transitionEl.style.opacity = '0';
  setTimeout(() => {
    transitionEl.style.pointerEvents = 'none';
    transitionEl.innerHTML = '';
  }, 600);

  // 7. Init paradise
  initParadise();
}

// ─── Jump cats during transition ──────────────────
function showJumpCats() {
  if (!jumpCatsEl) return;
  const EMOJIS = ['😸','🐱','😺','😻','🐈','🐾','💕','✨'];
  const count  = reducedMotion() ? 6 : 16;

  for (let i = 0; i < count; i++) {
    const cat = document.createElement('div');
    cat.className = 'jump-cat';
    const x = R.range(5, 92);
    const finalY = R.range(-40, -80);
    cat.textContent = R.pick(EMOJIS);
    cat.style.cssText = [
      `left:${x}vw`,
      `--jump-y:${finalY + 20}px`,
      `--final-y:${finalY}px`,
      `--jump-dur:${R.range(0.8, 1.6)}s`,
      `animation-delay:${i * 0.07}s`,
      `font-size:${R.range(2, 4)}rem`,
    ].join(';');
    jumpCatsEl.appendChild(cat);
  }
}

// ─── Init paradise screen ──────────────────────────
function initParadise() {
  // Sky
  initSky();

  // Confetti
  initConfetti();

  // Cats
  populateCats(18);

  // Start periodic paw prints near the bottom
  if (!reducedMotion()) {
    setInterval(() => {
      spawnPawPrint(
        R.range(20, window.innerWidth - 40),
        R.range(window.innerHeight * 0.45, window.innerHeight * 0.68),
        document.getElementById('confetti-layer')
      );
    }, R.range(2000, 4000));
  }
}

// ─── Smile button ─────────────────────────────────
function handleSmile() {
  const rect = btnSmile.getBoundingClientRect();
  const cx   = rect.left + rect.width / 2;
  const cy   = rect.top  + rect.height / 2;
  burstHearts(cx, cy);
  AudioManager.playSparkle();
  // Flash button
  btnSmile.style.transform = 'scale(1.25)';
  setTimeout(() => btnSmile.style.transform = '', 300);
}

// ─── Music toggle ──────────────────────────────────
function handleMusicToggle() {
  const playing = AudioManager.toggle();
  updateMusicControls(playing);
}

function updateMusicControls(playing) {
  musicToggle.setAttribute('aria-pressed', playing);
  if (playing) {
    musicIcon.textContent = '🔊';
    musicLabel.textContent = 'Pause Music';
    musicViz.classList.add('active');
  } else {
    musicIcon.textContent = '🎵';
    musicLabel.textContent = 'Play Music';
    musicViz.classList.remove('active');
  }
}

// ─── Event wiring ──────────────────────────────────
function wireEvents() {
  window.addEventListener('musicstatechange', () => {
    updateMusicControls(AudioManager.getIsPlaying());
  });

  // Gift open — use click only (works on mobile too after user gesture).
  // touchstart would double-fire on iOS because the synthesised click fires afterwards.
  if (openGiftBtn) {
    openGiftBtn.addEventListener('click', openGiftSequence);
  }

  // Clicking the gift box itself also triggers the open
  if (giftBox) {
    giftBox.addEventListener('click', (e) => {
      // Avoid double-fire when the button inside the gift was clicked
      if (e.target === openGiftBtn || openGiftBtn.contains(e.target)) return;
      if (!openGiftBtn.disabled) openGiftSequence();
    });
  }

  // Smile burst (click handles mobile too)
  if (btnSmile) {
    btnSmile.addEventListener('click', handleSmile);
  }

  // More cats
  if (btnMoreCats) {
    btnMoreCats.addEventListener('click', spawnMoreCats);
  }

  // Music
  if (musicToggle) {
    musicToggle.addEventListener('click', handleMusicToggle);
  }
}

// ─── Startup ───────────────────────────────────────
function init() {
  // Opening particles
  initOpeningParticles();

  // Wire all events
  wireEvents();

  // Accessibility: add skip link behaviour for keyboard users
  document.querySelectorAll('.action-btn').forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Resize: no layout fix needed since we use %, vw, vh consistently.
  // Touch device: add class to body for CSS targeting if needed
  if (isTouch()) document.body.classList.add('touch-device');
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
