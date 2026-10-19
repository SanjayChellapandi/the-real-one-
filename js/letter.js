/**
 * letter.js — Heartfelt letter with typewriter animation
 *
 * Opens the letter modal, types the message character by character,
 * and triggers the special scene after the letter finishes.
 */

'use strict';

// ─── Letter content ────────────────────────────────
const LETTER_TEXT = `My Favourite Person 💗🐱

Out of all the people I may meet in this lifetime, there's a place in my heart that will always remind me of you. Nobody could be you to me, because what you mean to me is uniquely yours. ❤️ you be you with me ..

I don't just want to be a part of your happy moments today; I hope we can share countless memories, grow together, and stay special in each other's lives for years to come. 🫶🏻

I don't want to be someone you remember only from your past. I hope to be someone you genuinely want beside you in your future, too. 🐾💗`;

// ─── State ─────────────────────────────────────────
let typewriterTimer = null;
let isMidTyping     = false;

// ─── Typewriter ────────────────────────────────────
async function typewriterEffect(text, container, speed = 28) {
  isMidTyping = true;
  container.textContent = '';

  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'letter-cursor';
  container.appendChild(cursor);

  for (let i = 0; i < text.length; i++) {
    if (!isMidTyping) break; // allow early stop

    // Insert character before cursor
    const charNode = document.createTextNode(text[i]);
    container.insertBefore(charNode, cursor);

    // Scroll to bottom
    const scroll = container.closest('.letter-scroll');
    if (scroll) scroll.scrollTop = scroll.scrollHeight;

    // Vary speed: punctuation = longer pause
    const ch = text[i];
    const pause = (ch === '\n') ? speed * 3
                : (ch === '.' || ch === '!' || ch === '?') ? speed * 6
                : (ch === ',') ? speed * 4
                : speed;

    await wait(pause);
  }

  // Remove cursor; show footer + Okay button
  cursor.remove();
  isMidTyping = false;

  const footer = document.getElementById('letter-footer');
  if (footer) {
    footer.hidden = false;
  }

  // Reveal the manual Okay button
  const okayBtn = document.getElementById('letter-okay-btn');
  if (okayBtn) okayBtn.hidden = false;
}

// ─── Open letter ───────────────────────────────────
function openLetter() {
  const modal = document.getElementById('letter-modal');
  const body  = document.getElementById('letter-body');
  const footer = document.getElementById('letter-footer');
  if (!modal || !body) return;

  // Reset
  isMidTyping = false;
  body.textContent = '';
  if (footer) footer.hidden = true;
  const okayBtn = document.getElementById('letter-okay-btn');
  if (okayBtn) okayBtn.hidden = true;

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  AudioManager.playSparkle();

  // Start typing after modal animation
  setTimeout(() => typewriterEffect(LETTER_TEXT, body, 22), 500);
}

// ─── Close letter ──────────────────────────────────
function closeLetter() {
  isMidTyping = false;
  const modal = document.getElementById('letter-modal');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  AudioManager.playMusic();
  // Hide okay button for next open
  const okayBtn = document.getElementById('letter-okay-btn');
  if (okayBtn) okayBtn.hidden = true;
}

// ─── Trigger special scene after letter ────────────
function triggerSpecialScene() {
  closeLetter();
  setTimeout(() => {
    const scene = document.getElementById('special-scene');
    const paradise = document.getElementById('paradise-screen');
    if (!scene) return;

    if (paradise) paradise.style.zIndex = '1';
    scene.hidden = false;
    scene.style.zIndex = '150';

    // Init scene
    window.initSpecialScene && window.initSpecialScene();
  }, 400);
}

// ─── Wire up events ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn  = document.getElementById('letter-close');
  const letterBtn = document.getElementById('btn-letter');
  const overlay   = document.getElementById('letter-modal');

  if (closeBtn)  closeBtn.addEventListener('click', closeLetter);
  if (letterBtn) letterBtn.addEventListener('click', openLetter);

  // Okay button → close letter then show special scene
  const okayBtn = document.getElementById('letter-okay-btn');
  if (okayBtn) {
    okayBtn.addEventListener('click', () => {
      closeLetter();
      setTimeout(triggerSpecialScene, 400);
    });
  }

  // Keyboard: Escape closes (✕ button still works; overlay click does NOT auto-close)
  document.addEventListener('keydown', (e) => {
    if (overlay && e.key === 'Escape' && !overlay.hidden) closeLetter();
  });
});

window.openLetter  = openLetter;
window.closeLetter = closeLetter;
