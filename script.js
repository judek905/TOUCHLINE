/* ===== Touchline: edit this CONFIG block to change content ===== */
const CONFIG = {
  payNumber: "0748756534",
  previewSeconds: 120,                 // free live preview length
  // Replace with your real live stream (HLS .m3u8 or .mp4). This is a public test stream.
  liveSrc: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  // Set to false once you verify payments on a server (see note at bottom).
  demoUnlock: true
};

const PLANS = [
  { id: "day",    name: "Match day pass", price: 5000,   perks: ["Full live match for 24 hours", "All replays for 24 hours", "No ads"] },
  { id: "month",  name: "Monthly",        price: 30000,  perks: ["Every live match", "Full replay library", "HD stream", "No ads"], best: true },
  { id: "season", name: "Season",         price: 250000, perks: ["Everything in Monthly", "Full season, one payment", "Early access to highlights"] }
];

const FIXTURES = [
  { home: "Kampala City", away: "Entebbe United", score: "2 – 1", status: "67'", comp: "Premier League", live: true },
  { home: "Jinja Rovers", away: "Mbarara FC", score: "0 – 0", status: "Starts 18:00", comp: "Premier League" },
  { home: "Gulu Stars", away: "Mukono Athletic", score: "–", status: "Starts 20:15", comp: "Cup" }
];

const REPLAYS = [
  { t: "Kampala City 3–2 Jinja Rovers", comp: "Premier League", date: "28 Sep 2026", dur: "1:52:10", premium: false, c: "#e4372b" },
  { t: "Gulu Stars 1–1 Entebbe United", comp: "Cup", date: "21 Sep 2026", dur: "1:48:33", premium: true, c: "#2a6fdb" },
  { t: "Mbarara FC 2–0 Mukono Athletic", comp: "Premier League", date: "14 Sep 2026", dur: "1:50:02", premium: true, c: "#8a3ffc" },
  { t: "Cup final highlights", comp: "Cup", date: "7 Sep 2026", dur: "12:40", premium: false, c: "#ffb400" },
  { t: "Entebbe United 4–3 Kampala City", comp: "Premier League", date: "31 Aug 2026", dur: "1:55:47", premium: true, c: "#00a676" },
  { t: "Best goals of the month", comp: "Highlights", date: "30 Aug 2026", dur: "8:15", premium: false, c: "#e4372b" }
];
// Replace with real match videos (mp4 URLs). This sample plays for every card.
const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const GALLERY = ["Opening whistle", "Corner kick", "The winning goal", "Supporters in the stand", "Keeper's save", "Trophy lift", "Tunnel walk", "Final whistle"];

/* ===== Helpers ===== */
const $ = (s, r = document) => r.querySelector(s);
const fmt = n => "UGX " + n.toLocaleString("en-US");
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};
function isPremium() {
  const raw = store.get("tl_premium");
  if (!raw) return false;
  try { const { until } = JSON.parse(raw); return Date.now() < until; } catch { return false; }
}
// Generated placeholder art so no image link can break. Swap for real <img src="photos/x.jpg">.
function art(label, color, w = 640, h = 360) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#0e3b2e"/>
  <g stroke="rgba(243,241,231,.35)" stroke-width="3" fill="none">
    <rect x="20" y="20" width="${w - 40}" height="${h - 40}"/><line x1="${w / 2}" y1="20" x2="${w / 2}" y2="${h - 20}"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="${h / 6}"/></g>
  <circle cx="${w * .7}" cy="${h * .4}" r="${h * .09}" fill="${color}"/>
  <path d="M0 ${h} L${w * .35} ${h * .55} L${w * .6} ${h} Z" fill="${color}" opacity=".35"/></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/* ===== Live player with free preview ===== */
const video = $("#liveVideo"), lock = $("#lock");
let watched = 0, timer;
function loadLive() {
  if (window.Hls && Hls.isSupported() && CONFIG.liveSrc.endsWith(".m3u8")) {
    const hls = new Hls(); hls.loadSource(CONFIG.liveSrc); hls.attachMedia(video);
  } else { video.src = CONFIG.liveSrc; }
}
function applyAccess() {
  const premium = isPremium();
  $("#previewHint").hidden = premium;
  if (premium) { lock.hidden = true; clearInterval(timer); }
}
video.addEventListener("play", () => {
  if (isPremium()) return;
  clearInterval(timer);
  timer = setInterval(() => {
    if (video.paused) return;
    if (++watched >= CONFIG.previewSeconds) {
      video.pause(); lock.hidden = false; clearInterval(timer);
      if (document.fullscreenElement) document.exitFullscreen();
    }
  }, 1000);
});

/* ===== Fixtures ===== */
const fx = $("#fixtures");
FIXTURES.forEach((m, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<button class="fx" ${i === 0 ? 'aria-current="true"' : ""}>
    <b>${m.home} v ${m.away}</b><span class="${m.live ? "st" : ""}">${m.live ? "Live " : ""}${m.status}</span><small>${m.comp}</small></button>`;
  li.firstElementChild.addEventListener("click", e => {
    fx.querySelectorAll(".fx").forEach(b => b.removeAttribute("aria-current"));
    e.currentTarget.setAttribute("aria-current", "true");
    $("#homeName").textContent = m.home; $("#awayName").textContent = m.away;
    $("#score").textContent = m.score; $("#clock").textContent = m.status;
  });
  fx.append(li);
});

/* ===== Replays ===== */
const comps = ["All", ...new Set(REPLAYS.map(r => r.comp))];
const chips = $("#chips"), grid = $("#replayGrid");
comps.forEach((c, i) => {
  const b = document.createElement("button");
  b.className = "chip"; b.textContent = c; b.setAttribute("aria-pressed", i === 0);
  b.onclick = () => { chips.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); renderReplays(c); };
  chips.append(b);
});
function renderReplays(filter = "All") {
  grid.innerHTML = "";
  REPLAYS.filter(r => filter === "All" || r.comp === filter).forEach(r => {
    const b = document.createElement("button");
    b.className = "card";
    b.innerHTML = `<img alt="" src="${art(r.t, r.c)}">
      ${r.premium && !isPremium() ? '<span class="badge">Premium</span>' : ""}
      <span class="dur">${r.dur}</span>
      <span class="meta"><b>${r.t}</b><span>${r.comp}, ${r.date}</span></span>`;
    b.onclick = () => openReplay(r);
    grid.append(b);
  });
}
function openReplay(r) {
  if (r.premium && !isPremium()) return openPay();
  video.pause(); video.removeAttribute("src"); video.src = SAMPLE_VIDEO; video.play();
  $("#homeName").textContent = r.t; $("#awayName").textContent = ""; $("#score").textContent = "Replay"; $("#clock").textContent = r.dur;
  document.querySelector(".live-tag").hidden = true;
  $("#live").scrollIntoView();
}

/* ===== Gallery ===== */
const cols = ["#e4372b", "#ffd23f", "#2a6fdb", "#00a676", "#8a3ffc"];
GALLERY.forEach((g, i) => {
  const f = document.createElement("figure");
  f.innerHTML = `<img loading="lazy" alt="${g}" src="${art(g, cols[i % 5], 480, i % 5 === 0 ? 520 : 260)}"><figcaption>${g}</figcaption>`;
  $("#galleryGrid").append(f);
});

/* ===== Plans and payment ===== */
$("#plans").innerHTML = PLANS.map(p => `
  <article class="plan ${p.best ? "best" : ""}">
    <h3>${p.name}</h3><div class="price">${fmt(p.price)}</div>
    <ul>${p.perks.map(x => `<li>${x}</li>`).join("")}</ul>
    <button class="btn btn-gold" data-open-pay data-plan="${p.id}">Choose ${p.name}</button>
  </article>`).join("");
$("#planPick").innerHTML = PLANS.map((p, i) => `
  <label><input type="radio" name="plan" value="${p.id}" ${p.best ? "checked" : ""}><span>${p.name}</span><span>${fmt(p.price)}</span></label>`).join("");

const dlg = $("#payDialog");
const step = n => [1, 2, 3].forEach(i => $("#payStep" + i).hidden = i !== n);
function openPay(planId) {
  if (planId) { const r = document.querySelector(`input[name=plan][value=${planId}]`); if (r) r.checked = true; }
  step(1); $("#payErr").textContent = ""; dlg.showModal();
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-open-pay]");
  if (t) openPay(t.dataset.plan);
});
const chosen = () => PLANS.find(p => p.id === document.querySelector("input[name=plan]:checked").value);
let ref = "";
$("#toStep2").onclick = () => {
  const name = $("#payName").value.trim(), phone = $("#payPhone").value.replace(/\s/g, "");
  if (name.length < 2) return $("#payErr").textContent = "Enter your name.";
  if (!/^(\+?256|0)7\d{8}$/.test(phone)) return $("#payErr").textContent = "Enter a valid Ugandan mobile number, like 0748756534.";
  ref = "TL" + Math.random().toString(36).slice(2, 8).toUpperCase();
  $("#payAmount").textContent = fmt(chosen().price); $("#payRef").textContent = ref; step(2);
};
$("#backStep").onclick = () => step(1);
$("#confirmPaid").onclick = () => {
  const p = chosen(), days = { day: 1, month: 30, season: 300 }[p.id];
  // IMPORTANT: this unlocks on trust. For real money, verify the payment on a server first.
  if (CONFIG.demoUnlock) store.set("tl_premium", JSON.stringify({ plan: p.id, ref, until: Date.now() + days * 864e5 }));
  $("#payDone").textContent = `${p.name} is active. Keep your reference ${ref} in case support needs it.`;
  step(3); applyAccess(); renderReplays(document.querySelector(".chip[aria-pressed=true]").textContent);
};
$("#closeDone").onclick = () => { dlg.close(); video.play().catch(() => {}); };

/* ===== Init ===== */
loadLive(); applyAccess(); renderReplays();

/* NOTE ON PAYMENTS
   Sending money to a number cannot be confirmed from the browser. To go live, add a backend that
   uses a Mobile Money collection API (MTN MoMo or Airtel Money, or an aggregator like Flutterwave
   or Pesapal), confirms each payment by reference, then issues the premium token. Then set
   CONFIG.demoUnlock = false. */
