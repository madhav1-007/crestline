const grid = document.getElementById("grid"), read = document.getElementById("read");
const cohorts = ["Aug 4", "Aug 11", "Aug 18", "Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22"];
const value = (ci, w) => Math.round(100 * Math.pow(0.7 + ci * 0.012, w));
let cells = [];

function build() {
  grid.innerHTML = "<div></div>" + [0,1,2,3,4,5,6,7].map(w => `<div class="h">W${w}</div>`).join("");
  cohorts.forEach((name, ci) => {
    grid.insertAdjacentHTML("beforeend", `<div class="l">${name}</div>`);
    for (let w = 0; w < 8; w++) {
      const c = document.createElement("div");
      if (w > 7 - ci) { c.className = "c e"; grid.append(c); continue; }   // future weeks: no data yet
      const v = value(ci, w);
      c.className = "c"; c.textContent = v; c.dataset.r = ci; c.dataset.w = w; c.dataset.d = (ci + w) * 55;
      c.style.background = `rgba(0,168,150,${0.12 + (v / 100) * 0.88})`;
      c.addEventListener("mouseenter", () => (read.textContent = `Signed up week of ${name}: ${v}% still active in week ${w}`));
      grid.append(c);
    }
  });
  cells = [...grid.querySelectorAll(".c:not(.e)")];
  play();
}
function play() {
  cells.forEach(c => { c.classList.remove("in", "dim"); c.style.transitionDelay = c.dataset.d + "ms"; });
  void grid.offsetWidth;
  requestAnimationFrame(() => cells.forEach(c => c.classList.add("in")));
  setTimeout(() => cells.forEach(c => (c.style.transitionDelay = "0ms")), 1500);   // so hover reacts instantly
}
grid.addEventListener("mouseover", e => {      // crosshair: fade everything outside the hovered row and column
  const t = e.target.closest(".c:not(.e)");
  cells.forEach(c => c.classList.toggle("dim", !!t && c.dataset.r !== t.dataset.r && c.dataset.w !== t.dataset.w));
});
grid.addEventListener("mouseleave", () => cells.forEach(c => c.classList.remove("dim")));
document.getElementById("replay").addEventListener("click", play);

AskGemini.mount({
  title: "Ask Gemini about retention",
  suggestions: ["Are newer users sticking around better?", "When do most people leave?", "How could we keep more users?"],
  getContext: () => "Retention percent by sign-up week, then week 0 to 7: " +
    cohorts.map((n, ci) => `${n}: ` + Array.from({ length: 8 - ci }, (_, w) => value(ci, w)).join(", ")).join(" | ") + "."
});
build();
