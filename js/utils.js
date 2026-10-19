/**
 * utils.js — Shared helper functions
 * Lightweight utilities used across all modules.
 */

'use strict';

// ─── Random helpers ────────────────────────────────
const R = {
  /** Random float between min and max */
  range: (min, max) => Math.random() * (max - min) + min,

  /** Random integer between min and max (inclusive) */
  int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  /** Pick a random item from an array */
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],

  /** Random boolean with optional probability (default 50%) */
  bool: (p = 0.5) => Math.random() < p,

  /** Random positive or negative (sign) */
  sign: () => (Math.random() < 0.5 ? 1 : -1),
};

// ─── DOM helpers ───────────────────────────────────
/**
 * Create and return a DOM element with optional props.
 * @param {string} tag
 * @param {object} opts — { className, id, style, attrs, text }
 * @param {Element} parent — append to parent if provided
 */
function el(tag, opts = {}, parent = null) {
  const e = document.createElement(tag);
  if (opts.className) e.className = opts.className;
  if (opts.id)        e.id = opts.id;
  if (opts.text)      e.textContent = opts.text;
  if (opts.innerHTML) e.innerHTML = opts.innerHTML;
  if (opts.style)     Object.assign(e.style, opts.style);
  if (opts.attrs)     Object.entries(opts.attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent)         parent.appendChild(e);
  return e;
}

/**
 * Fire a callback once after the CSS transition / animation ends.
 * Falls back to a timeout if no event fires.
 */
function onTransitionEnd(element, cb, fallbackMs = 1000) {
  let done = false;
  const finish = () => { if (!done) { done = true; cb(); } };
  element.addEventListener('transitionend', finish, { once: true });
  element.addEventListener('animationend',  finish, { once: true });
  setTimeout(finish, fallbackMs);
}

/**
 * Delay utility (Promise-based).
 */
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Clamp a value between min and max.
 */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * Viewport width / height (with mobile-safe dvh).
 */
const vw = () => window.innerWidth;
const vh = () => window.innerHeight;

/**
 * Detect touch device.
 */
const isTouch = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

/**
 * Detect if reduced-motion is preferred.
 */
const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Throttle a function (leading edge).
 */
function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}

/**
 * Spawn a floating emoji at a given position on screen.
 * Returns the element so the caller can remove it if needed.
 */
function spawnFloatingEmoji(emoji, x, y, container = document.body, extraClass = '') {
  const e = el('div', {
    className: `burst-heart ${extraClass}`,
    text: emoji,
    style: {
      left: x + 'px',
      top:  y + 'px',
      '--tx': R.range(-60, 60) + 'px',
      '--ty': R.range(-100, -40) + 'px',
      '--dur': R.range(0.9, 1.6) + 's',
      '--size': R.range(1, 2.2) + 'rem',
      '--rot': R.range(-45, 45) + 'deg',
    },
  }, container);
  setTimeout(() => e.remove(), 1800);
  return e;
}

// Expose globally
window.R     = R;
window.el    = el;
window.wait  = wait;
window.clamp = clamp;
window.vw    = vw;
window.vh    = vh;
window.isTouch      = isTouch;
window.reducedMotion = reducedMotion;
window.throttle     = throttle;
window.onTransitionEnd = onTransitionEnd;
window.spawnFloatingEmoji = spawnFloatingEmoji;
