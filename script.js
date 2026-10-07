// Four layered waves, one per screen. Hover to lift a wave, click to open that screen.
const cv = document.getElementById("stage"), ctx = cv.getContext("2d"), label = document.getElementById("label");
const layers = [
  { n: "Revenue", c: "#5b3df5", href: "revenue/index.html" },
  { n: "Funnel", c: "#ff5c8a", href: "funnel/index.html" },
  { n: "Cohorts", c: "#00a896", href: "cohort/index.html" },
  { n: "Live", c: "#f5a524", href: "live/index.html" }
];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lift = [0, 0, 0, 0];
let W, H, mx = -1, my = -1, t = 0, act = -1;

function size() {
  const r = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
}
function yAt(i, x) {                       // height of wave i at horizontal position x
  const A = H * 0.04 * (1 + lift[i] * 0.9);
  let y = H * (0.56 + i * 0.1) + Math.sin(x * 0.006 + t * 0.9 + i * 1.7) * A + Math.sin(x * 0.013 - t * 1.3 + i) * A * 0.45;
  if (mx >= 0) y -= lift[i] * H * 0.05 * Math.exp(-Math.pow((x - mx) / 160, 2));   // bulge under the cursor
  return y - lift[i] * H * 0.03;
}
function frame() {
  if (!reduced) t += 0.016;
  act = -1;
  if (mx >= 0) for (let i = 3; i >= 0; i--) if (my >= yAt(i, mx)) { act = i; break; }   // front-most wave under the pointer
  lift.forEach((_, i) => (lift[i] += ((i === act ? 1 : 0) - lift[i]) * 0.08));
  cv.style.cursor = act >= 0 ? "pointer" : "default";
  label.textContent = act >= 0 ? "Open " + layers[act].n : "Hover a wave";

  ctx.clearRect(0, 0, W, H);
  layers.forEach((L, i) => {
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, yAt(i, x));
    ctx.lineTo(W, H); ctx.closePath();
    ctx.globalAlpha = act < 0 || i === act ? 0.95 : 0.72; ctx.fillStyle = L.c; ctx.fill();
    if (i === act) {                                   // bright edge on the hovered wave
      ctx.globalAlpha = 0.7; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = 0; x <= W + 8; x += 8) x ? ctx.lineTo(x, yAt(i, x)) : ctx.moveTo(x, yAt(i, x));
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.fillStyle = "#fff"; ctx.font = `700 ${i === act ? 24 : 20}px Sora, "Segoe UI", sans-serif`;
    ctx.fillText(L.n, Math.max(16, W * 0.05), yAt(i, W * 0.05) + 38);
  });
  requestAnimationFrame(frame);
}
cv.addEventListener("pointermove", e => { const b = cv.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
cv.addEventListener("pointerdown", e => { const b = cv.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
cv.addEventListener("pointerleave", () => { mx = my = -1; });
cv.addEventListener("click", () => { if (act >= 0) location.href = layers[act].href; });
addEventListener("resize", size);

// the headline letters bob up and down like they are floating on the waves
const h1 = document.querySelector("h1"), word = h1.textContent;
h1.setAttribute("aria-label", word);
h1.innerHTML = [...word].map((ch, i) => `<span class="l" aria-hidden="true" style="--i:${i}">${ch}</span>`).join("");
// tour rows slide in as they scroll into view
document.documentElement.classList.add("js");
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .3 });
document.querySelectorAll(".tour a").forEach(a => (reduced ? a.classList.add("in") : io.observe(a)));

size(); frame();
