const sets = { week: [10000, 3200, 1400, 420], last: [9200, 2700, 1250, 330] };
const names = ["Visitors", "Sign-ups", "Free trials", "Paid customers"];
const box = document.getElementById("stages"), rate = document.getElementById("rate");

function render(key) {
  const d = sets[key]; window.fkey = key;
  box.innerHTML = "";
  d.forEach((v, i) => {
    const s = document.createElement("div");
    s.className = "stage";
    const step = i ? `${((v / d[i - 1]) * 100).toFixed(0)}% of the step before, ${(d[i - 1] - v).toLocaleString()} left` : "Everyone who arrived";
    s.innerHTML = `<b>${names[i]}</b> <span class="note">${step}</span>
      <div class="track"><div class="fill">${v.toLocaleString()}</div></div>`;
    box.append(s);
    const f = s.querySelector(".fill");
    setTimeout(() => (f.style.width = (v / d[0]) * 100 + "%"), 80 + i * 180);
  });
  rate.textContent = ((d[3] / d[0]) * 100).toFixed(1) + "%";
}
document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b));
  render(b.dataset.s);
}));
render("week");
AskGemini.mount({
  title: "Ask Gemini about this funnel",
  suggestions: ["Where do we lose the most people?", "Is this week better than last week?", "How could we improve it?"],
  getContext: () => { const k = window.fkey || "week", d = sets[k];
    return `Conversion funnel (${k === "week" ? "this week" : "last week"}): ` + names.map((n, i) => `${n} ${d[i]}`).join(", ") + "."; }
});
