// Shared "Ask Gemini" helper box. The visitor pastes their OWN key; it stays in the input box only.
(function () {
  const MODELS = ["gemini-3.5-flash", "gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"]; // tries the next if one is missing or busy
  const CSS = `
  .gem{position:relative;overflow:hidden}
  .gem-h{display:flex;gap:.6rem;align-items:center}
  .gem-orb{width:24px;height:24px;border-radius:50%;background:conic-gradient(var(--violet),var(--pink),var(--amber),var(--teal),var(--violet));animation:gspin 4s linear infinite}
  .gem.busy .gem-orb{animation-duration:.7s;box-shadow:0 0 18px var(--pink)}
  @keyframes gspin{to{transform:rotate(360deg)}}
  .gem-note{color:var(--muted);font-size:.9rem;margin:.4rem 0 .8rem}
  .gem label{display:block;font-weight:600;margin:.5rem 0}
  .gem input{width:100%;font:inherit;padding:.5rem .7rem;border:2px solid var(--ink);border-radius:8px;background:var(--bg);color:var(--ink)}
  .gem-chips{display:flex;gap:.5rem;flex-wrap:wrap;margin:.7rem 0}
  .gem-chips button{font-size:.85rem;padding:.25rem .7rem;border-radius:99px}
  .gem-out{margin-top:.8rem;white-space:pre-wrap;min-height:1.5em}
  .gem-out.typing::after{content:"";display:inline-block;width:.5em;height:1em;background:var(--pink);margin-left:2px;vertical-align:-2px;animation:gblink .7s steps(2) infinite}
  @keyframes gblink{50%{opacity:0}}`;

  function mount(o) {
    const st = document.createElement("style"); st.textContent = CSS; document.head.append(st);
    const box = document.createElement("section"); box.className = "gem card";
    box.innerHTML = `<div class="gem-h"><span class="gem-orb"></span><b></b></div>
      <p class="gem-note">Optional. Paste your own Gemini API key (free at aistudio.google.com). It stays in this tab only and is never saved.</p>
      <label>Gemini API key<input type="password" autocomplete="off" placeholder="Paste key here"></label>
      <div class="gem-chips"></div>
      <label>Your question<input type="text"></label>
      <button class="go">Ask Gemini</button>
      <p class="gem-out" role="status" aria-live="polite"></p>`;
    box.querySelector("b").textContent = o.title;
    const [keyEl, qEl] = box.querySelectorAll("input"), out = box.querySelector(".gem-out");
    const go = box.querySelector(".go"), chips = box.querySelector(".gem-chips");
    qEl.value = o.suggestions[0];
    o.suggestions.forEach(s => {
      const b = document.createElement("button"); b.textContent = s;
      b.addEventListener("click", () => { qEl.value = s; ask(); });
      chips.append(b);
    });

    function reveal(text) {               // types the answer out word by word
      const words = text.split(/(\s+)/); let i = 0; out.textContent = ""; out.classList.add("typing");
      const t = setInterval(() => {
        out.textContent += words[i++] || "";
        if (i >= words.length) { clearInterval(t); out.classList.remove("typing"); }
      }, 28);
    }
    async function ask() {
      const key = keyEl.value.trim();
      if (!key) { out.textContent = "Paste your own Gemini API key first."; return; }
      const prompt = `You are a friendly helper explaining data to a beginner.\nData: ${o.getContext()}\nQuestion: ${qEl.value}\nAnswer in at most 4 short, plain sentences. No markdown.`;
      go.disabled = true; box.classList.add("busy"); out.classList.remove("typing"); out.textContent = "Thinking...";
      let done = false, busy = false;
      for (const m of MODELS) {
        try {
          const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": key },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });
          if ([404, 429, 500, 503].includes(r.status)) { busy = busy || r.status !== 404; continue; }   // missing or busy: try the next model
          const j = await r.json(); done = true;
          if (r.ok) reveal((j.candidates?.[0]?.content?.parts || []).map(p => p.text).join("") || "Gemini returned no answer.");
          else out.textContent = "Gemini said: " + (j.error?.message || r.status) + ([400, 401, 403].includes(r.status) ? ". Check that the key is correct." : "");
          break;
        } catch (e) { done = true; out.textContent = "Could not reach Gemini. Check your internet connection."; break; }
      }
      if (!done) out.textContent = busy
        ? "Gemini is very busy right now (this is not a problem with your key). Wait a minute, then press Ask Gemini again."
        : "No Gemini model was found. Update the MODELS list in shared/ask-gemini.js.";
      go.disabled = false; box.classList.remove("busy");
    }
    go.addEventListener("click", ask);
    (document.querySelector(".wrap") || document.body).append(box);
  }
  window.AskGemini = { mount };
})();
