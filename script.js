/* =========================================================
   Edit the words here. Everything else reads from this.
   ========================================================= */

const QUALITIES = [
  { quality: "Soft-natured",                quote: "Gentle like moonlight. Never loud, always there.",       note: "Even your “no” sounds kind." },
  { quality: "Explains things beautifully", quote: "You talk, and I can see the whole story.",               note: "I'd listen to you explain anything." },
  { quality: "Reserved",                    quote: "Quiet like the mountains, and just as hard to move.",    note: "You choose your words, and your people, carefully." },
  { quality: "A genuinely good person",     quote: "Some people are good when it's easy. You just are.",     note: "The world's softer with you in it." },
  { quality: "Smart and intelligent",       quote: "Sharp mind, soft heart. A rare combination.",            note: "You make clever look easy." },
  { quality: "Caring",                      quote: "You notice the people others forget to.",                note: "Your kindness is quiet, and it stays." },
  { quality: "Sense of humour",             quote: "The reason my calls run two hours over.",                note: "Funnier than you let most people see." },
  { quality: "Patient",                     quote: "You never rush anyone, not even the moon.",              note: "Good things bloom slowly, like sunflowers." },
  { quality: "Loyal",                       quote: "Like the moon to the night, you stay.",                  note: "Rare, like a blue moon." },
  { quality: "Mature",                      quote: "Calm in every storm.",                                   note: "An old soul with a young laugh." },
  { quality: "Down to earth",               quote: "Moon-level glow, feet on the ground.",                   note: "No airs. Just grace." },
  { quality: "Respects family",             quote: "Your roots run deep, and it shows.",                     note: "You carry home with you everywhere." },
  { quality: "Playful once comfortable",    quote: "Reserved for the world, silly for a lucky few.",         note: "Lucky me." },
  { quality: "Honest",                      quote: "No filters, no games. Just you.",                        note: "I never have to guess with you." },
  { quality: "Thoughtful",                  quote: "A good-night text at 4:30 a.m. Need I say more?",        note: "You remember the little things." },
  { quality: "A great communicator",        quote: "Four-hour calls that feel like four minutes.",           note: "Hours pass. Never enough." },
];

// Closing message: each item fades in as its own line.
const CLOSING = [
  "You asked what qualities I like in a girl.",
  "I wrote them all down,",
  "and then realised I'd just described you,",
  "Chhoti Chand.",
];
const SIGNATURE = "— Anvesh or Sai";

/* ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);
const TOTAL = QUALITIES.length;

const state = {
  index: 0,
  opened: new Array(TOTAL).fill(false),
  busy: false,
};

/* ---------------- Moon surface ----------------
   A realistic near-side moon drawn once as an image: warm base, mottled texture,
   the dark "seas" (maria) roughly where they really are, a few bright craters
   (Tycho with its rays, Copernicus, Kepler), fine grain, and darker edges. */
function moonSurfaceURL() {
  const maria = [
    // [cx, cy, rx, ry, rotate]  (140×140 box, as seen from Earth)
    [52, 40, 17, 14, -10],  // Imbrium
    [26, 74, 14, 27, 12],   // Procellarum
    [88, 46, 11, 10, 0],    // Serenitatis
    [98, 70, 15, 11, 20],   // Tranquillitatis
    [123, 54, 8.5, 6.5, 0], // Crisium
    [110, 90, 7.5, 11, 10], // Fecunditatis
    [98, 100, 5.5, 5, 0],   // Nectaris
    [62, 98, 11, 7, -5],    // Nubium
    [72, 60, 6, 4.5, 0],    // Vaporum
    [70, 21, 30, 4.5, -4],  // Frigoris
    [44, 112, 8, 5, 20],    // Humorum
  ];
  const mariaSVG = maria.map(([x, y, rx, ry, r]) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})"/>`).join("");
  const cores = maria.slice(0, 6).map(([x, y, rx, ry, r]) =>
    `<ellipse cx="${x + 1}" cy="${y + 1}" rx="${rx * 0.55}" ry="${ry * 0.55}" transform="rotate(${r} ${x} ${y})"/>`).join("");

  // Tycho's bright rays
  let rays = "";
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + (i % 3) * 0.2;
    const len = 18 + ((i * 7) % 5) * 7;
    rays += `<line x1="66" y1="122" x2="${(66 + Math.cos(a) * len).toFixed(1)}" y2="${(122 + Math.sin(a) * len).toFixed(1)}"/>`;
  }

  // small craters: [x, y, r]
  const craters = [[40, 58, 1.6], [84, 86, 1.3], [112, 108, 1.5], [118, 76, 1], [56, 128, 1.4], [92, 120, 1.2],
    [34, 98, 1], [78, 32, 1.1], [104, 32, 1.3], [128, 96, 1], [20, 52, 1.1], [86, 132, 1.2], [60, 76, 0.9]];
  const craterSVG = craters.map(([x, y, r]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#B9AE95" opacity=".7"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${r * 0.6}" fill="#FFFDF4" opacity=".55"/>`).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="560" height="560">
  <defs>
    <clipPath id="c"><circle cx="70" cy="70" r="70"/></clipPath>
    <radialGradient id="base" cx="46%" cy="44%" r="62%">
      <stop offset="0" stop-color="#FFFCF2"/><stop offset=".6" stop-color="#F5EDD8"/><stop offset="1" stop-color="#E4D8BC"/>
    </radialGradient>
    <radialGradient id="limb" cx="50%" cy="50%" r="50%">
      <stop offset=".62" stop-color="#6E6047" stop-opacity="0"/><stop offset=".92" stop-color="#6E6047" stop-opacity=".22"/><stop offset="1" stop-color="#5A4C36" stop-opacity=".45"/>
    </radialGradient>
    <filter id="mottle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="4" seed="11"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .51  0 0 0 0 .44  1.5 0 0 0 -.6"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .42  0 0 0 0 .39  0 0 0 0 .33  1.3 0 0 0 -.5"/>
    </filter>
    <filter id="sea" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="1.8"/>
    </filter>
    <filter id="blur1"><feGaussianBlur stdDeviation=".7"/></filter>
  </defs>
  <g clip-path="url(#c)">
    <circle cx="70" cy="70" r="70" fill="url(#base)"/>
    <rect width="140" height="140" filter="url(#mottle)" opacity=".5"/>
    <g fill="#A49B85" opacity=".5" filter="url(#sea)">${mariaSVG}</g>
    <g fill="#8E836C" opacity=".22" filter="url(#sea)">${cores}</g>
    <g stroke="#FFFDF5" stroke-width=".9" opacity=".28" filter="url(#blur1)">${rays}</g>
    <circle cx="66" cy="122" r="2.3" fill="#FFFEF8"/><circle cx="66" cy="122" r="3.6" fill="none" stroke="#FFFDF2" stroke-width=".8" opacity=".6"/>
    <circle cx="44" cy="66" r="2" fill="#FFFDF4" opacity=".85"/><circle cx="44" cy="66" r="3.4" fill="#FFFDF4" opacity=".25" filter="url(#blur1)"/>
    <circle cx="30" cy="64" r="1.3" fill="#FFFDF4" opacity=".8"/>
    <circle cx="16" cy="58" r="1.5" fill="#FFFEF8" opacity=".9"/>
    ${craterSVG}
    <rect width="140" height="140" filter="url(#grain)" opacity=".35"/>
    <circle cx="70" cy="70" r="70" fill="url(#limb)"/>
  </g>
</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------------- Moon phase ---------------- */
// t: 0 = new moon, 1 = full moon (waxing, lit from the right).
const MOON = { cx: 100, cy: 100, r: 70 };
const START_PHASE = 0.06; // a thin crescent
let phaseNow = START_PHASE;
let phaseAnim = null;

function phasePath(t) {
  const { cx, cy, r } = MOON;
  const rx = Math.abs(1 - 2 * t) * r;
  const sweep = t < 0.5 ? 0 : 1; // crescent bulges right, gibbous bulges left
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx.toFixed(2)} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
}

function drawMoon(t) {
  $("litPath").setAttribute("d", phasePath(t));
  // Safari sometimes doesn't repaint a mask whose shape changed; re-attaching it forces a redraw.
  $("litImg").setAttribute("mask", "url(#litMask)");
  $("moon").style.setProperty("--glow", (0.25 + 0.75 * t).toFixed(3));
  // The moon also grows a little as it fills (used on the cards screen).
  const grow = Math.max(0, (t - START_PHASE) / (1 - START_PHASE));
  document.body.style.setProperty("--grow", grow.toFixed(3));
}

function setPhase(target) {
  if (phaseAnim) cancelAnimationFrame(phaseAnim);
  const from = phaseNow;
  const duration = reduceMotion ? 250 : 1400;
  const start = performance.now();
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const step = (now) => {
    const k = Math.min(1, (now - start) / duration);
    phaseNow = from + (target - from) * ease(k);
    drawMoon(phaseNow);
    if (k < 1) phaseAnim = requestAnimationFrame(step);
  };
  phaseAnim = requestAnimationFrame(step);
}

const phaseFor = (count) => START_PHASE + (1 - START_PHASE) * (count / TOTAL);

/* ---------------- Stars ---------------- */
function initStars() {
  const canvas = $("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let shooting = null;
  let nextShoot = performance.now() + 6000;
  let w = 0, h = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(220, Math.round((w * h) / 4500));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.pow(Math.random(), 1.6) * h * 0.75, // denser near the top
      r: 0.3 + Math.random() * 1.15,
      a: 0.35 + Math.random() * 0.6,
      s: 0.4 + Math.random() * 1.4,
      p: Math.random() * Math.PI * 2,
    }));
    if (reduceMotion) draw(0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const t = time / 1000;
    for (const st of stars) {
      const tw = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(t * st.s + st.p);
      ctx.globalAlpha = st.a * tw;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = "#FFF6D9";
      ctx.fill();
    }
    if (shooting) {
      const k = (time - shooting.start) / shooting.dur;
      if (k >= 1) shooting = null;
      else {
        const x = shooting.x + shooting.dx * k;
        const y = shooting.y + shooting.dy * k;
        const grad = ctx.createLinearGradient(x, y, x - shooting.dx * 0.18, y - shooting.dy * 0.18);
        grad.addColorStop(0, "rgba(255,246,217,0.9)");
        grad.addColorStop(1, "rgba(255,246,217,0)");
        ctx.globalAlpha = Math.sin(Math.PI * k);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - shooting.dx * 0.18, y - shooting.dy * 0.18);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(time) {
    if (!shooting && time > nextShoot) {
      shooting = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.25, dx: w * 0.35, dy: h * 0.12, start: time, dur: 1100 };
      nextShoot = time + 9000 + Math.random() * 9000;
    }
    draw(time);
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", debounce(resize, 200));
  if (!reduceMotion) requestAnimationFrame(loop);
}

/* ---------------- Lavender ---------------- */
function lavenderSVG(shades) {
  let buds = "";
  for (let i = 0; i < 9; i++) {
    const y = 4 + i * 3.3;
    const x = i % 2 ? 7.4 : 4.6;
    buds += `<ellipse cx="${x}" cy="${y}" rx="${2.1 - i * 0.06}" ry="3" fill="${shades[i % shades.length]}"/>`;
  }
  return `<svg viewBox="0 0 12 70" preserveAspectRatio="xMidYMax meet"><path d="M6 70 C 5.4 52 6.6 30 6 6" stroke="#6E9361" stroke-width="1.1" fill="none"/>${buds}</svg>`;
}

function buildLavender() {
  const w = window.innerWidth;
  const rows = [
    { el: $("lavBack"),  gap: 11, hMin: 56, hMax: 82, shades: ["#8D79CC", "#A08FDA", "#7A66BE"] },
    { el: $("lavFront"), gap: 13, hMin: 38, hMax: 58, shades: ["#B9A7E8", "#A592E0", "#CFC2F2"] },
  ];
  for (const row of rows) {
    const count = Math.min(150, Math.ceil(w / row.gap));
    let html = "";
    for (let i = 0; i < count; i++) {
      const h = row.hMin + Math.random() * (row.hMax - row.hMin);
      const x = (i + Math.random() * 0.8) * (100 / count);
      const d = (3 + Math.random() * 3).toFixed(2);
      const delay = (-Math.random() * 6).toFixed(2);
      const amp = (2 + Math.random() * 3).toFixed(1);
      html += `<div class="stalk" style="left:${x.toFixed(2)}%;height:${h.toFixed(0)}px;width:${(h * 0.17).toFixed(1)}px;--d:${d}s;--delay:${delay}s;--amp:${amp}deg">${lavenderSVG(row.shades)}</div>`;
    }
    row.el.innerHTML = html;
  }
}

/* ---------------- Sunflowers ---------------- */
// Order they bloom in, so the garden fills in scattered rather than left to right.
// Adapts automatically if you add or remove qualities.
const BLOOM_ORDER = (() => {
  const preferred = [8, 3, 13, 0, 11, 5, 16, 2, 9, 14, 6, 1, 17, 10, 4, 12, 7, 15].filter((s) => s < TOTAL);
  for (let s = 0; s < TOTAL; s++) if (!preferred.includes(s)) preferred.push(s);
  return preferred;
})();

// Drawn once into a hidden <svg> and reused by every flower with <use>.
function buildSprites() {
  const petal = "M0 -6.5 C -2.6 -8.5 -3.3 -13.5 -0.6 -18.6 Q 0 -19.6 0.6 -18.6 C 3.3 -13.5 2.6 -8.5 0 -6.5 Z";
  let back = "", front = "";
  for (let i = 0; i < 24; i++) {
    const jitter = ((i * 37) % 7) - 3;
    const len = 0.94 + ((i * 53) % 9) / 90;
    back += `<path d="${petal}" fill="url(#petalBack)" transform="rotate(${(i * 15 + 7.5 + jitter).toFixed(1)}) scale(1.02 ${len.toFixed(2)})"/>`;
  }
  for (let i = 0; i < 22; i++) {
    const jitter = ((i * 29) % 7) - 3;
    const len = 0.84 + ((i * 41) % 9) / 80;
    front += `<path d="${petal}" fill="url(#petalFront)" stroke="#C98608" stroke-width=".18" stroke-opacity=".5" transform="rotate(${(i * (360 / 22) + jitter).toFixed(1)}) scale(.95 ${len.toFixed(2)})"/>`;
  }
  // seed head: golden-angle spiral, the way real sunflowers pack their seeds
  let seeds = "";
  for (let n = 1; n < 120; n++) {
    const r = 0.66 * Math.sqrt(n);
    if (r > 7.2) break;
    const a = n * 2.39996;
    const c = n % 3 === 0 ? "#6B4416" : n % 3 === 1 ? "#3E2408" : "#52300C";
    seeds += `<circle cx="${(Math.cos(a) * r).toFixed(2)}" cy="${(Math.sin(a) * r).toFixed(2)}" r="${(0.3 + r * 0.025).toFixed(2)}" fill="${c}"/>`;
  }
  $("sprites").innerHTML = `
    <defs>
      <linearGradient id="petalBack" gradientUnits="userSpaceOnUse" x1="0" y1="-6" x2="0" y2="-19">
        <stop offset="0" stop-color="#B86A04"/><stop offset=".45" stop-color="#E39A12"/><stop offset="1" stop-color="#F2B734"/>
      </linearGradient>
      <linearGradient id="petalFront" gradientUnits="userSpaceOnUse" x1="0" y1="-6" x2="0" y2="-19">
        <stop offset="0" stop-color="#D98A06"/><stop offset=".35" stop-color="#F6BE22"/><stop offset="1" stop-color="#FFDB5C"/>
      </linearGradient>
      <radialGradient id="disc" cx="45%" cy="42%" r="55%">
        <stop offset="0" stop-color="#5A3A12"/><stop offset=".6" stop-color="#3A2208"/><stop offset="1" stop-color="#2A1704"/>
      </radialGradient>
      <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#3C6328"/><stop offset=".5" stop-color="#5E8F43"/><stop offset="1" stop-color="#355A23"/>
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6E9F4E"/><stop offset="1" stop-color="#3F6A2B"/>
      </linearGradient>
    </defs>
    <symbol id="sfHead" viewBox="-20 -20 40 40" overflow="visible">
      <circle r="8.6" fill="#7A4A0E"/>
      ${back}${front}
      <circle r="8" fill="url(#disc)"/>
      <circle r="7.6" fill="none" stroke="#C88E22" stroke-width="1" stroke-dasharray=".5 .7" opacity=".85"/>
      ${seeds}
      <ellipse cx="-2.6" cy="-2.8" rx="3.2" ry="2.2" fill="#FFF" opacity=".06"/>
    </symbol>
    <symbol id="sfLeaf" viewBox="0 0 20 12" overflow="visible">
      <path d="M0 6 C 4 0 12 -1 20 3 C 14 9 6 11 0 6 Z" fill="url(#leafGrad)"/>
      <path d="M0.5 6 C 6 4.6 12 3.8 19 3.2" stroke="#2F5220" stroke-width=".45" fill="none" opacity=".7"/>
      <path d="M6 5 L 8 2.2 M10 4.3 L 12.4 1.6 M8 5 L 9.6 7.6 M12.5 4 L 14.4 6.6" stroke="#2F5220" stroke-width=".3" opacity=".5"/>
    </symbol>`;
}

function sunflowerSVG(s) {
  const tilt = (((s * 47) % 31) - 15).toFixed(0);          // heads face slightly different ways
  const squash = (0.82 + ((s * 23) % 10) / 60).toFixed(2); // a little perspective
  const bend = (((s * 19) % 7) - 3).toFixed(1);
  return `<svg viewBox="0 0 40 100" preserveAspectRatio="xMidYMax meet">
    <path d="M18.9 100 C 18.2 78 ${20 + +bend} 48 19.2 24 L 20.8 24 C ${21.6 + +bend} 48 20.4 78 21.1 100 Z" fill="url(#stemGrad)"/>
    <use href="#sfLeaf" x="20" y="62" width="17" height="10" transform="rotate(-18 20 67)"/>
    <use href="#sfLeaf" x="20" y="46" width="15" height="9" transform="translate(40 0) scale(-1 1) rotate(-14 20 50)"/>
    <g transform="translate(20 20)">
      <g class="head">
        <g transform="rotate(${tilt}) scale(1 ${squash})">
          <use href="#sfHead" x="-20" y="-20" width="40" height="40"/>
        </g>
      </g>
    </g>
  </svg>`;
}

function buildSunflowers() {
  buildSprites();
  const box = $("flowers");
  let html = "";
  for (let s = 0; s < TOTAL; s++) {
    const x = 3 + (s + 0.5) * (94 / TOTAL) + (((s * 7) % 3) - 1) * 0.8;
    const h = 54 + ((s * 37) % 5) * 8; // 54..86px
    const w = h * 0.42;
    const d = (4 + ((s * 13) % 4)).toFixed(1);
    html += `<div class="sf" data-slot="${s}" style="left:calc(${x.toFixed(2)}% - ${(w / 2).toFixed(1)}px);height:${h}px;width:${w.toFixed(1)}px">
      <div class="sf-sway" style="--d:${d}s;--delay:-${s % 4}s">${sunflowerSVG(s)}</div></div>`;
  }
  box.innerHTML = html;
}

// Show exactly `count` sunflowers (the rest fold away).
function setGarden(count) {
  BLOOM_ORDER.forEach((slot, n) => {
    const el = document.querySelector(`.sf[data-slot="${slot}"]`);
    if (el) el.classList.toggle("bloom", n < count);
  });
}

// Progress = how far through the cards she is right now (not how many she's ever opened).
function currentProgress() {
  return state.opened[state.index] ? state.index + 1 : state.index;
}

function applyProgress(p) {
  setPhase(phaseFor(p));
  setGarden(p);
}

/* ---------------- Fireflies ---------------- */
function releaseFireflies() {
  if (reduceMotion) return;
  const box = $("fireflies");
  let html = "";
  for (let i = 0; i < 16; i++) {
    const left = 4 + Math.random() * 92;
    const bottom = 6 + Math.random() * 34;
    html += `<span class="firefly" style="left:${left}%;bottom:${bottom}%;--d:${(7 + Math.random() * 6).toFixed(1)}s;--delay:${(Math.random() * 5).toFixed(1)}s;--dx:${(Math.random() * 60 - 30).toFixed(0)}px"></span>`;
  }
  box.innerHTML = html;
}

/* ---------------- Parallax (cheap) ---------------- */
function initParallax() {
  if (reduceMotion) return;
  const layers = [
    [document.querySelector(".mtn.far"), 6],
    [document.querySelector(".mtn.mid"), 12],
    [document.querySelector(".mtn.near"), 20],
  ];
  const apply = (fx) => {
    for (const [el, amt] of layers) el.style.transform = `translateX(${(fx * amt).toFixed(1)}px)`;
  };
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    apply((e.clientX / window.innerWidth - 0.5) * -2);
  });
  // Works on Android without asking; iOS needs a permission prompt, so it simply stays still there.
  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    apply(Math.max(-1, Math.min(1, e.gamma / 30)) * -1);
  });
}

/* ---------------- Cards ---------------- */
function buildDots() {
  $("dots").innerHTML = QUALITIES.map(() => `<span class="dot"></span>`).join("");
}

function renderDots() {
  [...$("dots").children].forEach((d, i) => {
    d.classList.toggle("seen", state.opened[i]);
    d.classList.toggle("current", i === state.index);
  });
}

function renderCard() {
  const q = QUALITIES[state.index];
  $("cardNum").textContent = `No. ${state.index + 1} of ${TOTAL}`;
  $("quality").textContent = q.quality;
  $("quote").textContent = q.quote;
  $("note").textContent = q.note || "";
  $("card").setAttribute("aria-label", `${q.quality}. Tap to turn the card.`);
  renderControls();
  renderDots();
}

function renderControls() {
  const opened = state.opened[state.index];
  const last = state.index === TOTAL - 1;
  $("nextBtn").disabled = !opened;
  $("nextBtn").textContent = last ? "See the full moon 🌕" : "Next ›";
  $("prevBtn").classList.toggle("hidden", state.index === 0);
}

function flip() {
  if (state.busy) return;
  const card = $("card");
  card.classList.toggle("flipped");
  if (!state.opened[state.index]) {
    state.opened[state.index] = true;
    applyProgress(currentProgress());
    renderControls();
    renderDots();
  }
}

function goTo(newIndex) {
  if (state.busy || newIndex < 0 || newIndex >= TOTAL) return;
  state.busy = true;
  const card = $("card");
  card.classList.add("leaving");
  setTimeout(() => {
    state.index = newIndex;
    card.classList.add("no-anim");
    card.classList.toggle("flipped", false);
    card.classList.remove("leaving");
    card.classList.add("entering");
    renderCard();
    applyProgress(currentProgress());
    void card.offsetWidth; // let the browser register the starting position
    card.classList.remove("entering", "no-anim");
    state.busy = false;
  }, reduceMotion ? 120 : 360);
}

/* ---------------- Stages ---------------- */
function setStage(name) {
  document.body.className = `state-${name}`;
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(`${name}Screen`).classList.add("active");
}

function start() {
  if (!document.body.classList.contains("state-intro")) return;
  setStage("cards");
  renderCard();
  setTimeout(() => $("card").focus({ preventScroll: true }), 900);
}

function finish() {
  // Make sure the garden is complete and the moon is full.
  applyProgress(TOTAL);

  const msg = $("message");
  msg.innerHTML = "";
  CLOSING.forEach((line, i) => {
    const span = document.createElement("span");
    span.textContent = line;
    span.style.animationDelay = `${1.6 + i * 1.5}s`;
    msg.appendChild(span);
  });
  const after = 1.6 + CLOSING.length * 1.5 + 0.6;
  $("signature").textContent = SIGNATURE;
  $("signature").style.animationDelay = `${after}s`;
  $("againBtn").style.animationDelay = `${after + 2.5}s`;

  setStage("final");
  releaseFireflies();
}

function readAgain() {
  $("fireflies").innerHTML = "";
  setStage("cards");
  state.index = 0;
  state.opened.fill(false); // start the journey over: crescent moon, empty garden
  $("card").classList.remove("flipped");
  renderCard();
  applyProgress(0);
}

/* ---------------- Helpers & wiring ---------------- */
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

function init() {
  const surface = moonSurfaceURL();
  document.querySelectorAll(".moon-img").forEach((img) => img.setAttribute("href", surface));
  drawMoon(phaseNow);
  initStars();
  buildLavender();
  buildSunflowers();
  buildDots();
  initParallax();

  $("moon").addEventListener("click", start);
  $("card").addEventListener("click", flip);
  $("card").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
  $("nextBtn").addEventListener("click", () => {
    if (state.index === TOTAL - 1) finish();
    else goTo(state.index + 1);
  });
  $("prevBtn").addEventListener("click", () => goTo(state.index - 1));
  $("againBtn").addEventListener("click", readAgain);

  document.addEventListener("keydown", (e) => {
    if (!document.body.classList.contains("state-cards")) return;
    if (e.key === "ArrowRight" && state.opened[state.index]) $("nextBtn").click();
    if (e.key === "ArrowLeft") goTo(state.index - 1);
  });

  // Rebuild lavender only when the width really changes (not when a phone's address bar hides).
  let lastW = window.innerWidth;
  window.addEventListener("resize", debounce(() => {
    if (Math.abs(window.innerWidth - lastW) > 40) { lastW = window.innerWidth; buildLavender(); }
  }, 250));
}

init();
