/**
 * cats.js — Cat world engine
 *
 * Generates and manages all animated cat characters on the paradise screen:
 * - Running, walking, dancing, sleeping, stretching, bouncing cats
 * - Butterfly chasers and yarn-ball players
 * - Speech bubbles on click / touch
 * - Paw-print trails
 * - More Kitties button handler
 */

'use strict';

// ─── Cat SVG templates ─────────────────────────────
// Each returns an SVG string. Colours are parameterised.
function catSVG(base = '#f4c2c2', inner = '#ff9eb5', eye = '#2d1b69', extra = '') {
  return `
  <svg viewBox="0 0 120 130" class="cat-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <ellipse cx="60" cy="95" rx="32" ry="28" fill="${base}"/>
    <circle cx="60" cy="55" r="28" fill="${base}"/>
    <polygon points="36,35 28,10 50,30" fill="${base}"/>
    <polygon points="84,35 92,10 70,30" fill="${base}"/>
    <polygon points="38,33 32,16 48,30" fill="${inner}"/>
    <polygon points="82,33 88,16 72,30" fill="${inner}"/>
    <ellipse cx="50" cy="52" rx="6" ry="7" fill="${eye}"/>
    <ellipse cx="70" cy="52" rx="6" ry="7" fill="${eye}"/>
    <circle cx="52" cy="50" r="2" fill="white"/>
    <circle cx="72" cy="50" r="2" fill="white"/>
    <polygon points="60,61 57,64 63,64" fill="${inner}"/>
    <path d="M57,64 Q60,68 63,64" fill="none" stroke="${eye}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="30" y1="60" x2="52" y2="62" stroke="${eye}" stroke-width="1" opacity="0.5"/>
    <line x1="30" y1="65" x2="52" y2="65" stroke="${eye}" stroke-width="1" opacity="0.5"/>
    <line x1="68" y1="62" x2="90" y2="60" stroke="${eye}" stroke-width="1" opacity="0.5"/>
    <line x1="68" y1="65" x2="90" y2="65" stroke="${eye}" stroke-width="1" opacity="0.5"/>
    <ellipse cx="44" cy="120" rx="10" ry="7" fill="${base}"/>
    <ellipse cx="76" cy="120" rx="10" ry="7" fill="${base}"/>
    <path d="M92,105 Q115,90 110,118 Q105,128 92,120" fill="${base}"/>
    <ellipse cx="45" cy="63" rx="7" ry="4" fill="${inner}" opacity="0.5"/>
    <ellipse cx="75" cy="63" rx="7" ry="4" fill="${inner}" opacity="0.5"/>
    ${extra}
  </svg>`;
}

function sleepingCatSVG(base = '#f4c2c2', inner = '#ff9eb5') {
  return `
  <svg viewBox="0 0 160 100" class="cat-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <!-- Body lying down -->
    <ellipse cx="80" cy="62" rx="55" ry="28" fill="${base}"/>
    <!-- Head -->
    <circle cx="30" cy="45" r="24" fill="${base}"/>
    <!-- Ears -->
    <polygon points="14,28 8,10 26,26" fill="${base}"/>
    <polygon points="46,28 52,10 34,26" fill="${base}"/>
    <polygon points="15,27 10,14 25,25" fill="${inner}"/>
    <polygon points="45,27 50,14 35,25" fill="${inner}"/>
    <!-- Closed eyes (sleeping) -->
    <path d="M21,44 Q25,41 29,44" fill="none" stroke="#2d1b69" stroke-width="2" stroke-linecap="round"/>
    <path d="M33,44 Q37,41 41,44" fill="none" stroke="#2d1b69" stroke-width="2" stroke-linecap="round"/>
    <!-- Nose -->
    <polygon points="31,49 29,51 33,51" fill="${inner}"/>
    <!-- Tail curled -->
    <path d="M135,62 Q155,40 150,75 Q145,90 128,80" fill="none" stroke="${base}" stroke-width="16" stroke-linecap="round"/>
    <!-- Zzzs -->
    <text x="48" y="28" font-size="14" fill="#b39ddb" font-family="Arial" opacity="0.8">z</text>
    <text x="58" y="18" font-size="18" fill="#ce93d8" font-family="Arial" opacity="0.7">z</text>
    <text x="72" y="10" font-size="22" fill="#f48fb1" font-family="Arial" opacity="0.6">Z</text>
    <!-- Paws tucked -->
    <ellipse cx="60" cy="82" rx="14" ry="8" fill="${base}"/>
    <ellipse cx="90" cy="82" rx="14" ry="8" fill="${base}"/>
    <!-- Blush -->
    <ellipse cx="20" cy="52" rx="6" ry="3" fill="${inner}" opacity="0.45"/>
    <ellipse cx="40" cy="52" rx="6" ry="3" fill="${inner}" opacity="0.45"/>
  </svg>`;
}

// ─── Cat colour palettes ───────────────────────────
const CAT_PALETTES = [
  { base:'#f4c2c2', inner:'#ff9eb5', eye:'#2d1b69' }, // pink
  { base:'#c2d4f4', inner:'#9eb5ff', eye:'#1a3a69' }, // blue
  { base:'#e1c2f4', inner:'#ce93d8', eye:'#4a1a69' }, // lavender
  { base:'#f4e8c2', inner:'#f0cc70', eye:'#4a3000' }, // cream
  { base:'#f4c9a2', inner:'#ff9966', eye:'#3a1500' }, // peach
  { base:'#c2f4d8', inner:'#66d9a0', eye:'#006633' }, // mint
  { base:'#ffd6f5', inner:'#ff99dd', eye:'#3d1a4f' }, // rose
  { base:'#d4f4f4', inner:'#66cccc', eye:'#004444' }, // teal
];

const CAT_TYPES = [
  'cat-run', 'cat-walk', 'cat-dance', 'cat-bounce',
  'cat-chase', 'cat-stretch',
];

const SLEEP_SPOTS = [
  { x:'8%',  y:'55%' },
  { x:'70%', y:'60%' },
  { x:'40%', y:'62%' },
];

const SPEECH_TEXTS = [
  'Meow! 💕', 'You\'re pawsome! 🐾', 'Smile, please! 😊',
  'I love you! 💗', '*purrs* ✨', 'You\'re the best! 🌟',
  'Mrrrow~ 🎵', 'Head bumps! 🐱', 'You deserve all the happiness! 💝',
  '*happy chirp*', 'So happy to see you! 😸', '*kneads*',
  'Best human ever! 💖', 'Forever yours~ 🐾',
];

// ─── Main state ────────────────────────────────────
let catCount = 0;
let catsLayer = null;
let pawTrailEnabled = true;
let lastPawTime = 0;

// ─── Create a cat entity ───────────────────────────
function createCat(opts = {}) {
  if (!catsLayer) return;

  catCount++;
  const palette  = opts.palette  || R.pick(CAT_PALETTES);
  const type     = opts.type     || R.pick(CAT_TYPES);
  const isFlipped = R.bool(0.45);

  const wrapper = document.createElement('div');
  wrapper.className = `cat-entity ${type}`;
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('aria-label', 'A cute cat — click to say hello!');
  wrapper.id = `cat-${catCount}`;

  // ── Position & movement vars ──
  const yPos = R.range(20, 68); // % from top, keep away from header/buttons

  if (type === 'cat-run' || type === 'cat-walk') {
    const goLeft = R.bool();
    const dur    = type === 'cat-run' ? R.range(5, 11) : R.range(10, 18);
    wrapper.style.cssText = [
      `top:${yPos}%`,
      `--start-x:${goLeft ? '110vw' : '-130px'}`,
      `--end-x:${goLeft ? '-130px' : '110vw'}`,
      `--run-dur:${dur}s`,
      `--walk-dur:${dur}s`,
      `--face:${goLeft ? -1 : 1}`,
      `animation-delay:-${R.range(0, dur)}s`,
    ].join(';');
  } else if (type === 'cat-dance') {
    wrapper.style.cssText = [
      `left:${R.range(5, 80)}%`,
      `top:${yPos}%`,
      `--dance-dur:${R.range(0.6, 1.2)}s`,
    ].join(';');
  } else if (type === 'cat-bounce') {
    wrapper.style.cssText = [
      `left:${R.range(5, 80)}%`,
      `top:${yPos}%`,
    ].join(';');
  } else if (type === 'cat-chase') {
    wrapper.style.cssText = [
      `left:${R.range(5, 60)}%`,
      `top:${yPos}%`,
      `--chase-dur:${R.range(7, 14)}s`,
    ].join(';');
    // Add a butterfly near the cat
    addButterfly(wrapper);
  } else if (type === 'cat-stretch') {
    wrapper.style.cssText = [
      `left:${R.range(5, 80)}%`,
      `top:${yPos}%`,
    ].join(';');
  }

  wrapper.innerHTML = catSVG(palette.base, palette.inner, palette.eye,
    isFlipped ? 'style="transform:scaleX(-1)"' : '');

  // Click / touch → speech bubble + sound
  const handleInteract = (e) => {
    e.stopPropagation();
    showSpeechBubble(wrapper);
    AudioManager.playCatMeow();
    // Quick pop animation
    wrapper.classList.add('cat-clicked');
    setTimeout(() => wrapper.classList.remove('cat-clicked'), 700);
    // Spawn heart trail
    const rect = wrapper.getBoundingClientRect();
    spawnFloatingEmoji('💗', rect.left + rect.width / 2, rect.top, document.getElementById('burst-layer'));
  };

  wrapper.addEventListener('click',      handleInteract);
  wrapper.addEventListener('touchstart', handleInteract, { passive: true });
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleInteract(e);
  });

  catsLayer.appendChild(wrapper);
  return wrapper;
}

// ─── Sleeping cats ─────────────────────────────────
function createSleepingCat(spot) {
  if (!catsLayer) return;
  catCount++;
  const palette = R.pick(CAT_PALETTES);
  const wrapper = document.createElement('div');
  wrapper.className = 'cat-entity cat-sleep';
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('aria-label', 'A sleeping kitty — click to wake up!');
  wrapper.style.cssText = `left:${spot.x};top:${spot.y};width:110px;`;
  wrapper.innerHTML = sleepingCatSVG(palette.base, palette.inner);

  const wake = (e) => {
    e.stopPropagation();
    showSpeechBubble(wrapper, '*yawns* Meow? 😴');
    AudioManager.playCatMeow();
    wrapper.classList.add('cat-clicked');
    setTimeout(() => wrapper.classList.remove('cat-clicked'), 700);
    const rect = wrapper.getBoundingClientRect();
    spawnFloatingEmoji('💗', rect.left + 55, rect.top, document.getElementById('burst-layer'));
  };

  wrapper.addEventListener('click', wake);
  wrapper.addEventListener('touchstart', wake, { passive: true });
  catsLayer.appendChild(wrapper);
}

// ─── Add butterfly ─────────────────────────────────
function addButterfly(parent) {
  const b = document.createElement('div');
  b.className = 'butterfly';
  b.innerHTML = `<div class="butterfly-wings">
    <div class="butterfly-wing"></div>
    <div class="butterfly-body"></div>
    <div class="butterfly-wing"></div>
  </div>`;
  b.style.cssText = [
    `top:-30px`,
    `left:30px`,
    `--fly-dur:${R.range(8, 14)}s`,
  ].join(';');
  parent.appendChild(b);
}

// ─── Yarn ball ─────────────────────────────────────
function addYarnBall(x, y) {
  if (!catsLayer) return;
  const yarn = document.createElement('div');
  yarn.className = 'yarn-ball';
  yarn.style.cssText = `left:${x}px;top:${y}px;`;
  catsLayer.appendChild(yarn);
  setTimeout(() => yarn.remove(), 15000);
}

// ─── Speech bubble ─────────────────────────────────
function showSpeechBubble(catEl, customText = null) {
  // Remove existing bubble on this cat
  const existing = catEl.querySelector('.speech-bubble');
  if (existing) existing.remove();

  const text = customText || R.pick(SPEECH_TEXTS);
  const bubble = document.createElement('div');
  bubble.className = 'speech-bubble';
  bubble.textContent = text;
  bubble.style.cssText = [
    `bottom:calc(100% + 6px)`,
    `left:50%`,
    `transform:translateX(-50%)`,
  ].join(';');
  catEl.appendChild(bubble);
  setTimeout(() => bubble.remove(), 4000);
}

// ─── Paw print trail on mouse move ─────────────────
function setupPawTrail() {
  const layer = document.getElementById('cats-layer');
  if (!layer) return;

  const onMove = throttle((e) => {
    if (!pawTrailEnabled) return;
    const now = Date.now();
    if (now - lastPawTime < 600) return;
    lastPawTime = now;

    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    if (x == null) return;
    spawnPawPrint(x - 10, y - 10, document.getElementById('confetti-layer'));
  }, 200);

  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: true });
}

// ─── Initial cats population ───────────────────────
function populateCats(count = 18) {
  catsLayer = document.getElementById('cats-layer');
  if (!catsLayer) return;

  const reduced = reducedMotion();
  const actualCount = reduced ? Math.floor(count * 0.4) : count;

  // Variety mix
  const types = [
    'cat-run','cat-run','cat-run',
    'cat-walk','cat-walk',
    'cat-dance','cat-dance','cat-dance',
    'cat-bounce','cat-bounce',
    'cat-chase','cat-chase',
    'cat-stretch',
  ];

  for (let i = 0; i < actualCount; i++) {
    const type = types[i % types.length];
    createCat({ type });
  }

  // Fixed sleeping cats
  SLEEP_SPOTS.forEach((spot) => createSleepingCat(spot));

  // Yarn balls near bottom
  if (!reduced) {
    addYarnBall(R.range(60, 200), R.range(window.innerHeight * 0.55, window.innerHeight * 0.68));
    addYarnBall(R.range(window.innerWidth - 200, window.innerWidth - 60), R.range(window.innerHeight * 0.5, window.innerHeight * 0.65));
  }

  // Paw trail
  setupPawTrail();

  // Periodic speech bubbles on random cats
  if (!reduced) {
    setInterval(() => {
      const allCats = catsLayer.querySelectorAll('.cat-entity');
      if (allCats.length > 0) {
        const randomCat = R.pick(Array.from(allCats));
        showSpeechBubble(randomCat);
      }
    }, R.range(3500, 6000));
  }
}

// ─── Spawn more cats (button) ──────────────────────
function spawnMoreCats() {
  catsLayer = catsLayer || document.getElementById('cats-layer');
  const batchSize = reducedMotion() ? 3 : 8;
  for (let i = 0; i < batchSize; i++) {
    setTimeout(() => createCat(), i * 120);
  }
  // Burst of hearts
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  burstHearts(cx, cy);
  AudioManager.playSparkle();
}

// Expose
window.populateCats   = populateCats;
window.spawnMoreCats  = spawnMoreCats;
window.showSpeechBubble = showSpeechBubble;
