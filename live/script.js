const area = document.getElementById("area");
const N = 40;
const data = Array.from({ length: N }, (_, i) => 120 + Math.round(Math.sin(i / 4) * 15));
const pages = [["/pricing", 52], ["/", 80], ["/docs", 31], ["/blog", 22]];
const line = document.getElementById("line"), ping = document.getElementById("ping");
const now = document.getElementById("now"), box = document.getElementById("pages");
const btn = document.getElementById("pause");
let paused = false;

function draw() {
  const lo = Math.min(...data) - 5, hi = Math.max(...data) + 5;
  const y = v => 160 - ((v - lo) / (hi - lo)) * 150 - 5;
  line.setAttribute("points", data.map((v, i) => `${(i / (N - 1)) * 600},${y(v)}`).join(" "));
  area.setAttribute("points", line.getAttribute("points") + " 600,160 0,160");
  ping.style.top = (y(data[N - 1]) / 160) * 100 + "%";
  now.textContent = data[N - 1];
  const max = Math.max(...pages.map(p => p[1]));
  box.innerHTML = pages.slice().sort((a, b) => b[1] - a[1]).map(p =>
    `<div class="pg"><div style="flex:1"><span>${p[0]}</span><i style="width:${(p[1] / max) * 100}%"></i></div><b>${p[1]}</b></div>`).join("");
}
function tick() {
  if (paused) return;
  data.push(Math.max(60, data[N - 1] + Math.round((Math.random() - 0.5) * 14))); data.shift();
  pages.forEach(p => (p[1] = Math.max(5, p[1] + Math.round((Math.random() - 0.5) * 8))));
  draw();
}
btn.addEventListener("click", () => {
  paused = !paused;
  btn.textContent = paused ? "Resume" : "Pause";
  btn.setAttribute("aria-pressed", paused);
});
AskGemini.mount({
  title: "Ask Gemini about live traffic",
  suggestions: ["Is traffic going up or down?", "What is the busiest page?", "Should I be worried about anything?"],
  getContext: () => `People on site over the last ${data.length} seconds, oldest first: ${data.join(", ")}. Busiest pages right now: ${pages.map(p => p[0] + " " + p[1]).join(", ")}.`
});
draw(); setInterval(tick, 1000);
