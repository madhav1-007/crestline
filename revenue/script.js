const chart = document.getElementById("chart"), total = document.getElementById("total");
const delta = document.getElementById("delta"), read = document.getElementById("read");
let shown = 0;

function series(n) {            // sample data, same every time
  return Array.from({ length: n }, (_, i) =>
    Math.round(900 + i * (n > 30 ? 9 : 14) + Math.sin(i * 0.9) * 180 + Math.cos(i * 2.3) * 120));
}
function countTo(v) {           // animated count-up
  const from = shown, t0 = performance.now();
  (function f(t) {
    const p = Math.min(1, (t - t0) / 700);
    shown = Math.round(from + (v - from) * (1 - Math.pow(1 - p, 3)));
    total.textContent = "₹" + shown.toLocaleString("en-IN");
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
function render(n) {
  const d = (window.currentSeries = series(n)), max = Math.max(...d), half = Math.floor(n / 2);
  chart.innerHTML = "";
  d.forEach((v, i) => {
    const b = document.createElement("div");
    b.className = "bar"; b.style.transitionDelay = i * 12 + "ms";
    b.addEventListener("mouseenter", () => (read.textContent = `Day ${i + 1}: ₹${v.toLocaleString("en-IN")}`));
    chart.append(b);
    requestAnimationFrame(() => requestAnimationFrame(() => (b.style.height = (v / max) * 100 + "%")));
  });
  const a = d.slice(0, half).reduce((x, y) => x + y, 0), c = d.slice(half).reduce((x, y) => x + y, 0);
  const pct = ((c - a) / a) * 100;
  delta.className = pct >= 0 ? "up" : "down";
  delta.textContent = `${pct >= 0 ? "Up" : "Down"} ${Math.abs(pct).toFixed(1)}% in the second half of this range`;
  countTo(d.reduce((x, y) => x + y, 0));
}
document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b));
  render(+b.dataset.n);
}));
render(30);

AskGemini.mount({
  title: "Ask Gemini about this chart",
  suggestions: ["What stands out in this chart?", "Why might revenue have dipped?", "What should I do next?"],
  getContext: () => { const d = window.currentSeries || []; return `Daily revenue in rupees for the last ${d.length} days, oldest first: ${d.join(", ")}.`; }
});
