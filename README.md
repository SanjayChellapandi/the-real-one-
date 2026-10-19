# 🐱💗 A Little World Made Just for You

A magical, cat-themed surprise website built with pure HTML, CSS, and JavaScript — no frameworks, no external assets.

## ✨ Features

| Section | What it does |
|---|---|
| 🎁 Opening Screen | Gift box opens with sparkles and jumping cats |
| 🐈 Cat Paradise | 18+ animated cats — running, dancing, sleeping, chasing butterflies |
| 😊 Smile Burst | Heart & kitten shower on demand |
| 🐾 More Kitties | Spawn extra cats any time |
| 💌 Heartfelt Letter | Elegant typewriter-animated personal message |
| ✨ Special Scene | Two cats meeting under a starry sky |
| 🎵 Music | Web Audio API generated melody — no files needed |

## 📁 File Structure

```
an/
├── index.html          ← Main page
├── css/
│   ├── style.css       ← Core design system
│   ├── cats.css        ← Cat character styles
│   └── animations.css  ← Particles & burst effects
├── js/
│   ├── utils.js        ← Shared helpers
│   ├── audio.js        ← Web Audio music & sound
│   ├── particles.js    ← Floating hearts, confetti, sparkles
│   ├── cats.js         ← Cat world engine
│   ├── letter.js       ← Typewriter letter module
│   ├── scene.js        ← Special two-cat scene
│   └── main.js         ← Orchestrator
└── README.md
```

## 🚀 Running Locally

**Option 1 — Just open the file:**
```
double-click index.html
```
Works in any modern browser (Chrome, Firefox, Safari, Edge).

**Option 2 — Local dev server (recommended for audio):**
```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code: use the Live Server extension
```
Then open `http://localhost:8080`.

> **Note:** Some browsers block the Web Audio API on `file://` URLs.  
> Running via a local server ensures music works correctly.

## 🌐 Deploying Online

**GitHub Pages (free):**
1. Push this folder to a GitHub repository
2. Go to Settings → Pages → Source: main branch / root
3. Your site is live at `https://yourusername.github.io/repo-name/`

**Netlify (drag & drop):**
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `an/` folder onto the page
3. Done — instant live URL!

**Vercel:**
```bash
npx vercel --prod
```

## 🎨 Customisation

| Thing | Where to change |
|---|---|
| Letter message | `js/letter.js` → `LETTER_TEXT` constant |
| Cat colours | `js/cats.js` → `CAT_PALETTES` array |
| Number of initial cats | `js/main.js` → `populateCats(18)` call |
| Background gradient | `css/style.css` → `#opening-screen` rule |
| Music melody | `js/audio.js` → `MELODY` array |
| Speech bubble texts | `js/cats.js` → `SPEECH_TEXTS` array |

## ♿ Accessibility

- Respects `prefers-reduced-motion` — animations are minimal when enabled
- All interactive elements have `aria-label` attributes
- Keyboard navigable (Tab + Enter/Space)
- High-contrast readable text throughout
- Audio starts only after user gesture

## 📱 Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+  
Mobile: iOS Safari 14+, Android Chrome 90+
