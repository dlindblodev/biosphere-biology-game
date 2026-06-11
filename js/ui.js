// ui.js — all DOM overlay management: menu, HUD, prompts, narrative concept
// panels, the interactive challenge (quiz), journey map, and dialogue.

const $ = (id) => document.getElementById(id);

const el = {
  reticle: $("reticle"), prompt: $("prompt"), hud: $("hud"),
  hudUnit: $("hud-unit"), hudTitle: $("hud-title"), hudObj: $("hud-objectives"),
  overlay: $("overlay"), panelTag: $("panel-tag"), panelTitle: $("panel-title"),
  panelBody: $("panel-body"), panelActions: $("panel-actions"),
  menu: $("menu"), menuStory: $("menu-story"), menuButtons: $("menu-buttons"),
  map: $("map"), mapGrid: $("map-grid"), mapClose: $("map-close"),
  loading: $("loading"),
};

export const UI = {
  onOverlayOpen: null,   // set by main: pause pointer lock
  onOverlayClose: null,

  hideLoading() { el.loading.classList.add("hidden"); },

  /* ---------------- Menu ---------------- */
  showMenu(storyHTML, buttons) {
    el.menuStory.innerHTML = storyHTML;
    el.menuButtons.innerHTML = "";
    buttons.forEach((b) => {
      const btn = document.createElement("button");
      btn.className = "btn" + (b.ghost ? " ghost" : "");
      btn.textContent = b.label;
      btn.onclick = b.onClick;
      el.menuButtons.appendChild(btn);
    });
    el.menu.classList.remove("hidden");
  },
  hideMenu() { el.menu.classList.add("hidden"); },

  /* ---------------- HUD ---------------- */
  showHUD() { el.hud.classList.remove("hidden"); el.reticle.classList.remove("hidden"); },
  hideHUD() { el.hud.classList.add("hidden"); el.reticle.classList.add("hidden"); },

  setChapter(chapter, unit) {
    el.hudUnit.textContent = `Unit ${unit.n} · Ch ${chapter.n} / 21`;
    el.hudTitle.textContent = chapter.title;
  },
  setObjectives(chapter, state) {
    const items = chapter.objectives.map((o, i) => {
      const done = state.readConcepts.has(i) || state.passed;
      return `<div class="obj ${done ? "done" : ""}"><span class="box"></span><span>${o}</span></div>`;
    }).join("");
    const passLine = `<div class="obj ${state.passed ? "done" : ""}" style="margin-top:10px;border-top:1px solid var(--line);padding-top:9px"><span class="box"></span><span>Pass the chamber Challenge</span></div>`;
    el.hudObj.innerHTML = `<h4>Learning Objectives</h4>${items}${passLine}`;
  },

  /* ---------------- Reticle + prompt ---------------- */
  setReticle(active) { el.reticle.classList.toggle("active", active); },
  setPrompt(html) {
    if (!html) { el.prompt.classList.add("hidden"); return; }
    el.prompt.innerHTML = html; el.prompt.classList.remove("hidden");
  },

  /* ---------------- Generic overlay ---------------- */
  _openOverlay() { el.overlay.classList.remove("hidden"); if (this.onOverlayOpen) this.onOverlayOpen(); },
  closeOverlay() { el.overlay.classList.add("hidden"); if (this.onOverlayClose) this.onOverlayClose(); },

  dialogue({ tag, title, bodyHTML, actions }) {
    el.panelTag.textContent = tag || "";
    el.panelTitle.textContent = title || "";
    el.panelBody.innerHTML = bodyHTML || "";
    el.panelActions.innerHTML = "";
    (actions || []).forEach((a) => {
      const btn = document.createElement("button");
      btn.className = "btn" + (a.ghost ? " ghost" : "");
      btn.textContent = a.label;
      btn.onclick = () => a.onClick();
      el.panelActions.appendChild(btn);
    });
    this._openOverlay();
  },

  /* ---------------- Concept (narrative explainer) ---------------- */
  showConcept(chapter, concept, isFirst, introHTML, onDone) {
    let body = "";
    if (isFirst && introHTML) {
      body += `<div class="helix"><div class="av"></div><div>${introHTML}</div></div>`;
    }
    body += `<p>${concept.b}</p>`;
    this.dialogue({
      tag: `${chapter.room} · Concept`,
      title: concept.t,
      bodyHTML: body,
      actions: [{ label: "Understood ▸", onClick: () => { this.closeOverlay(); onDone(); } }],
    });
  },

  /* ---------------- Challenge (quiz) ---------------- */
  runQuiz(chapter, onPass) {
    const qs = chapter.quiz;
    let idx = 0, correctCount = 0, answered = false;
    const results = new Array(qs.length).fill(null);

    const render = () => {
      const q = qs[idx];
      const pips = qs.map((_, i) => {
        const r = results[i];
        return `<i class="${r === true ? "on" : r === false ? "bad" : ""}"></i>`;
      }).join("");
      el.panelTag.textContent = `${chapter.room} · Challenge`;
      el.panelTitle.textContent = "Prove Your Mastery";
      el.panelBody.innerHTML =
        `<div class="q-prog">${pips}</div>` +
        `<div class="q-num">Question ${idx + 1} of ${qs.length}</div>` +
        `<div class="q-text">${q.q}</div>` +
        `<div id="q-opts">${q.a.map((opt, i) => `<button class="opt" data-i="${i}">${opt}</button>`).join("")}</div>` +
        `<div id="q-fb"></div>`;
      el.panelActions.innerHTML = "";
      answered = false;

      el.panelBody.querySelectorAll(".opt").forEach((b) => {
        b.onclick = () => choose(parseInt(b.dataset.i, 10));
      });
      this._openOverlay();
    };

    const choose = (i) => {
      if (answered) return;
      answered = true;
      const q = qs[idx];
      const ok = i === q.c;
      results[idx] = ok;
      if (ok) correctCount++;
      el.panelBody.querySelectorAll(".opt").forEach((b) => {
        const bi = parseInt(b.dataset.i, 10);
        b.disabled = true;
        if (bi === q.c) b.classList.add("correct");
        else if (bi === i) b.classList.add("wrong");
      });
      const fb = $("q-fb");
      fb.className = "q-feedback " + (ok ? "ok" : "no");
      fb.innerHTML = `<b>${ok ? "Correct." : "Not quite."}</b> ${q.e}`;
      // re-render pips
      el.panelBody.querySelector(".q-prog").innerHTML = qs.map((_, k) => {
        const r = results[k]; return `<i class="${r === true ? "on" : r === false ? "bad" : ""}"></i>`;
      }).join("");

      const last = idx === qs.length - 1;
      el.panelActions.innerHTML = "";
      const next = document.createElement("button");
      next.className = "btn";
      if (!last) { next.textContent = "Next ▸"; next.onclick = () => { idx++; render(); }; }
      else { next.textContent = "See Results ▸"; next.onclick = finish; }
      el.panelActions.appendChild(next);
    };

    const finish = () => {
      const passed = correctCount === qs.length;
      const score = `${correctCount} / ${qs.length}`;
      if (passed) {
        this.dialogue({
          tag: `${chapter.room} · Challenge Passed`,
          title: `Mastered — ${score}`,
          bodyHTML: `<div class="helix"><div class="av"></div><div>${chapter.clue}</div></div>`,
          actions: [{ label: "Continue ▸", onClick: () => { this.closeOverlay(); onPass(); } }],
        });
      } else {
        this.dialogue({
          tag: `${chapter.room} · Challenge`,
          title: `Score: ${score}`,
          bodyHTML: `<p>You need every answer correct to master this chapter's objectives. Review the data nodes if you like, then try again — you've got this.</p>`,
          actions: [
            { label: "Retry Challenge ▸", onClick: () => { idx = 0; correctCount = 0; results.fill(null); render(); } },
            { label: "Review concepts", ghost: true, onClick: () => this.closeOverlay() },
          ],
        });
      }
    };

    render();
  },

  /* ---------------- Map ---------------- */
  showMap(units, chapters, progress, currentN) {
    let html = "";
    units.forEach((u) => {
      html += `<div class="unit-row">Unit ${u.n} — ${u.name}</div>`;
      chapters.filter((c) => c.unit === u.n).forEach((c) => {
        const done = progress.completed.includes(c.n);
        const current = c.n === currentN;
        const locked = c.n > progress.maxUnlocked;
        const status = done ? "Mastered ✓" : current ? "Current" : locked ? "Locked" : "Available";
        html += `<div class="mapcell ${done ? "done" : ""} ${current ? "current" : ""} ${locked ? "locked" : ""}">
          <div class="cn">Chapter ${c.n}</div><div class="ct">${c.title}</div><div class="cs">${status}</div></div>`;
      });
    });
    el.mapGrid.innerHTML = html;
    el.map.classList.remove("hidden");
    if (this.onOverlayOpen) this.onOverlayOpen();
  },
  hideMap() { el.map.classList.add("hidden"); if (this.onOverlayClose) this.onOverlayClose(); },
  bindMapClose(fn) { el.mapClose.onclick = fn; },
  isMapOpen() { return !el.map.classList.contains("hidden"); },
  isOverlayOpen() { return !el.overlay.classList.contains("hidden"); },
};
