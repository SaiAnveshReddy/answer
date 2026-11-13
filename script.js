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
  openedCount: 0,
  busy: false,
};

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

function sunflowerSVG() {
  let petals = "";
  for (let k = 0; k < 14; k++) {
    petals += `<ellipse cx="20" cy="9.5" rx="3" ry="7" fill="#E8A91E" transform="rotate(${k * (360 / 14) + 360 / 28} 20 20)"/>`;
  }
  for (let k = 0; k < 14; k++) {
    petals += `<ellipse cx="20" cy="8.5" rx="3.2" ry="7.6" fill="#F4C430" transform="rotate(${k * (360 / 14)} 20 20)"/>`;
  }
  return `<svg viewBox="0 0 40 100" preserveAspectRatio="xMidYMax meet">
    <path d="M20 100 C 18.8 78 21.2 50 20 26" stroke="#4F7A3B" stroke-width="2.4" fill="none"/>
    <path d="M20 72 C 27 62 33 64 37 59 C 33 70 27 74 20 74 Z" fill="#5E8C45"/>
    <path d="M20 58 C 13 50 8 52 4 47 C 7 58 13 61 20 61 Z" fill="#557F3F"/>
    <g class="head">
      ${petals}
      <circle cx="20" cy="20" r="6.8" fill="#6B3F1F"/>
      <circle cx="20" cy="20" r="4.4" fill="#4E2C14"/>
      <circle cx="18.2" cy="18.4" r=".7" fill="#9A6A35"/><circle cx="21.8" cy="18.8" r=".7" fill="#9A6A35"/>
      <circle cx="19.6" cy="21.8" r=".7" fill="#9A6A35"/><circle cx="22.2" cy="21.6" r=".6" fill="#9A6A35"/>
      <circle cx="17.6" cy="21.2" r=".6" fill="#9A6A35"/>
    </g>
  </svg>`;
}

function buildSunflowers() {
  const box = $("flowers");
  const slots = TOTAL;
  let html = "";
  for (let s = 0; s < slots; s++) {
    const x = 3 + (s + 0.5) * (94 / slots) + (((s * 7) % 3) - 1) * 0.8;
    const h = 56 + ((s * 37) % 5) * 9; // 56..92px
    const d = (4 + ((s * 13) % 4)).toFixed(1);
    html += `<div class="sf" data-slot="${s}" style="left:calc(${x.toFixed(2)}% - ${(h * 0.2).toFixed(1)}px);height:${h}px;width:${(h * 0.4).toFixed(1)}px">
      <div class="sf-sway" style="--d:${d}s;--delay:-${s % 4}s">${sunflowerSVG()}</div></div>`;
  }
  box.innerHTML = html;
}

function bloom(n) {
  const slot = BLOOM_ORDER[n];
  const el = document.querySelector(`.sf[data-slot="${slot}"]`);
  if (el) el.classList.add("bloom");
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
    bloom(state.openedCount);
    state.openedCount++;
    setPhase(phaseFor(state.openedCount));
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
  for (let n = 0; n < TOTAL; n++) bloom(n);
  setPhase(1);

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
  $("card").classList.remove("flipped");
  renderCard();
}

/* ---------------- Helpers & wiring ---------------- */
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

function init() {
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
