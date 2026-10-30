/* =========================================================================
   Estadística · Laboratorio de práctica
   Lógica de la aplicación. Sin dependencias.
   ========================================================================= */

(function () {
  "use strict";

  /* ------------------------------ Constantes ---------------------------- */
  const STORE_KEY = "estadistica-lab:progress:v1";
  const THEME_KEY = "estadistica-lab:theme:v1";
  const LEVELS = { 1: "Básico", 2: "Intermedio", 3: "Avanzado" };
  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
  const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

  /* ------------------------------ Estado -------------------------------- */
  const state = {
    view: "home",
    progress: loadProgress(),
    builder: { mode: "practice", topic: "all", count: 10 },
    session: null
  };

  let timerId = null;
  let dialogResolve = null;

  /* ------------------------------ DOM ----------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const homeView = $("#view-home");
  const quizView = $("#view-quiz");
  const resultsView = $("#view-results");
  const progressView = $("#view-progress");
  const formulasView = $("#view-formulas");
  const toolsView = $("#view-tools");
  const dialog = $("#appDialog");
  const themeToggle = $("#themeToggle");

  /* ------------------------------ Utilidades ---------------------------- */
  function shuffle(items) {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatNumber(value, maxDecimals = 4) {
    if (!Number.isFinite(value)) return "—";
    const clean = Math.abs(value) < 1e-12 ? 0 : value;
    let out = clean.toFixed(maxDecimals);
    if (out.indexOf(".") !== -1) out = out.replace(/\.?0+$/, "");
    if (out === "-0") out = "0";
    return out.replace(".", ",");
  }

  function formatFixed(value, decimals = 2) {
    if (!Number.isFinite(value)) return "—";
    return value.toFixed(decimals).replace(".", ",");
  }

  function formatProbability(p) {
    if (!Number.isFinite(p)) return "—";
    if (p > 0 && p < 0.0001) return "< 0,0001";
    return p.toFixed(4).replace(".", ",");
  }

  function formatTime(totalSeconds) {
    const secs = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function parseNumber(raw) {
    let s = String(raw == null ? "" : raw)
      .trim()
      .replace(/\s+/g, "")
      .replace(/[−–—]/g, "-")
      .replace(/%/g, "")
      .replace(",", ".");
    if (!s) return NaN;
    const fraction = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (fraction) {
      const den = Number(fraction[2]);
      if (!den) return NaN;
      return Number(fraction[1]) / den;
    }
    if (!/^-?\d+(?:\.\d+)?$/.test(s)) return NaN;
    return Number(s);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function topicLabel(id) {
    if (id === "all") return "Sesión mixta";
    return TOPIC_BY_ID[id] ? TOPIC_BY_ID[id].short : "Tema";
  }

  function topicName(id) {
    if (id === "all") return "Todos los temas";
    return TOPIC_BY_ID[id] ? TOPIC_BY_ID[id].name : "Tema";
  }

  function defaultFormula(topicId) {
    const group = FORMULAS.find((g) => g.topic === topicId);
    return group && group.items.length ? group.items[0].formula : "";
  }

  /* ------------------------------ Persistencia -------------------------- */
  function emptyProgress() {
    return {
      topics: {},
      wrong: {},
      answered: 0,
      correct: 0,
      bestStreak: 0,
      sessions: 0,
      history: []
    };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return emptyProgress();
      const parsed = JSON.parse(raw);
      return {
        topics: parsed.topics && typeof parsed.topics === "object" ? parsed.topics : {},
        wrong: parsed.wrong && typeof parsed.wrong === "object" ? parsed.wrong : {},
        answered: Number(parsed.answered) || 0,
        correct: Number(parsed.correct) || 0,
        bestStreak: Number(parsed.bestStreak) || 0,
        sessions: Number(parsed.sessions) || 0,
        history: Array.isArray(parsed.history) ? parsed.history.slice(0, 12) : []
      };
    } catch (err) {
      return emptyProgress();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.progress));
    } catch (err) {
      /* El juego funciona aunque el almacenamiento esté bloqueado. */
    }
  }

  function recordAnswer(question, correct) {
    const p = state.progress;
    p.answered += 1;
    if (correct) p.correct += 1;

    const topic = p.topics[question.topic] || { seen: 0, correct: 0 };
    topic.seen += 1;
    if (correct) topic.correct += 1;
    p.topics[question.topic] = topic;

    if (correct) delete p.wrong[question.id];
    else p.wrong[question.id] = true;

    saveProgress();
  }

  /* ------------------------------ Tema ---------------------------------- */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) { /* sin persistencia */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0f1112" : "#f7f7f4");
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-label", isDark ? "Activar tema claro" : "Activar tema oscuro");
      themeToggle.setAttribute("title", isDark ? "Tema claro" : "Tema oscuro");
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (err) { /* sin persistencia */ }
    applyTheme(saved === "dark" ? "dark" : "light");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      });
    }
  }

  /* ------------------------------ Navegación ---------------------------- */
  function setView(name) {
    const target = document.getElementById(`view-${name}`);
    if (!target) return;
    state.view = name;
    $$(".view").forEach((view) => {
      view.hidden = view !== target;
    });
    $$(".nav-link").forEach((link) => {
      const active = link.dataset.nav === name;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (name !== "quiz") stopTimer();
    window.scrollTo({ top: 0, behavior: "auto" });

    if (name === "home") renderHome();
    if (name === "progress") renderProgress();
    if (name === "formulas") renderFormulas();
    if (name === "tools") calculateAllTools();
  }

  function navigate(name) {
    if (state.view === "quiz" && state.session && !state.session.finished && name !== "quiz") {
      confirmDialog({
        title: "¿Salir de la sesión?",
        message: "Si salís ahora, la sesión no se guardará en tu historial. Las preguntas ya respondidas en modo práctica sí quedan contabilizadas en tu progreso.",
        confirmLabel: "Salir",
        danger: true
      }).then((ok) => {
        if (!ok) return;
        stopTimer();
        state.session = null;
        setView(name);
      });
      return;
    }
    setView(name);
  }

  function confirmDialog({ title, message, confirmLabel = "Aceptar", cancelLabel = "Cancelar", danger = false }) {
    if (!dialog) return Promise.resolve(false);
    dialog.innerHTML = `
      <div class="dialog-inner">
        <h2 id="dialogTitle">${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
        <div class="dialog-actions">
          <button type="button" class="btn btn-ghost" data-dialog="cancel">${escapeHtml(cancelLabel)}</button>
          <button type="button" class="btn ${danger ? "btn-danger" : "btn-primary"}" data-dialog="ok">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>`;
    return new Promise((resolve) => {
      dialogResolve = resolve;
      dialog.showModal();
      const ok = dialog.querySelector('[data-dialog="ok"]');
      if (ok) ok.focus();
    });
  }

  function initDialog() {
    if (!dialog) return;
    dialog.addEventListener("click", (event) => {
      const button = event.target.closest("[data-dialog]");
      if (!button) return;
      const accepted = button.dataset.dialog === "ok";
      dialog.close();
      const resolve = dialogResolve;
      dialogResolve = null;
      if (resolve) resolve(accepted);
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      dialog.close();
      const resolve = dialogResolve;
      dialogResolve = null;
      if (resolve) resolve(false);
    });
  }

  /* ------------------------------ Inicio -------------------------------- */
  function initBuilder() {
    const select = $("#topicSelect");
    if (select) {
      select.innerHTML =
        '<option value="all">Todos los temas</option>' +
        TOPICS.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
      select.addEventListener("change", () => {
        state.builder.topic = select.value;
      });
    }

    const modeGroup = $("#modeGroup");
    if (modeGroup) {
      modeGroup.addEventListener("click", (event) => {
        const button = event.target.closest("[data-mode]");
        if (!button) return;
        state.builder.mode = button.dataset.mode;
        syncBuilder();
      });
    }

    const countGroup = $("#countGroup");
    if (countGroup) {
      countGroup.addEventListener("click", (event) => {
        const button = event.target.closest("[data-count]");
        if (!button) return;
        state.builder.count = button.dataset.count === "all" ? "all" : Number(button.dataset.count);
        syncBuilder();
      });
    }

    const start = $("#startSession");
    if (start) start.addEventListener("click", () => startSession(state.builder));
  }

  function syncBuilder() {
    $$("#modeGroup [data-mode]").forEach((button) => {
      const active = button.dataset.mode === state.builder.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $$("#countGroup [data-count]").forEach((button) => {
      const value = button.dataset.count === "all" ? "all" : Number(button.dataset.count);
      const active = value === state.builder.count;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const select = $("#topicSelect");
    if (select) select.value = state.builder.topic;
  }

  function renderHome() {
    const grid = $("#topicGrid");
    if (grid) {
      grid.innerHTML = TOPICS.map((topic) => {
        const stats = state.progress.topics[topic.id] || { seen: 0, correct: 0 };
        const total = QUESTIONS.filter((q) => q.topic === topic.id).length;
        const mastery = stats.seen ? Math.round((stats.correct / stats.seen) * 100) : 0;
        const label = stats.seen ? `Dominio ${mastery}%` : `${total} preguntas`;
        const detail = stats.seen ? `${stats.correct}/${stats.seen}` : "";
        return `
          <button type="button" class="topic-card" data-topic="${topic.id}" aria-label="Practicar ${escapeHtml(topic.name)}">
            <span class="topic-num">${topic.num}</span>
            <h3>${topic.name}</h3>
            <p>${topic.desc}</p>
            <div class="topic-foot">
              <div class="topic-progress">
                <div class="topic-progress-label"><span>${label}</span><span>${detail}</span></div>
                <div class="track"><div class="track-fill" style="width:${mastery}%"></div></div>
              </div>
              <span class="topic-arrow" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"></path></svg>
              </span>
            </div>
          </button>`;
      }).join("");
    }

    const wrongCount = Object.keys(state.progress.wrong).length;
    const callout = $("#reviewCallout");
    const reviewText = $("#reviewText");
    if (callout) callout.hidden = wrongCount === 0;
    if (reviewText && wrongCount) {
      reviewText.textContent =
        wrongCount === 1
          ? "Quedó 1 pregunta de tus últimas sesiones para volver a intentar."
          : `Quedaron ${wrongCount} preguntas de tus últimas sesiones para volver a intentar.`;
    }

    syncBuilder();
  }

  function initHome() {
    if (homeView) {
      homeView.addEventListener("click", (event) => {
        const card = event.target.closest("[data-topic]");
        if (card) {
          startSession({ mode: "practice", topic: card.dataset.topic, count: 10 });
        }
      });
    }
    const heroStart = $("#heroStart");
    if (heroStart) {
      heroStart.addEventListener("click", () => {
        startSession({ mode: "practice", topic: "all", count: 10 });
      });
    }
    const reviewStart = $("#reviewStart");
    if (reviewStart) reviewStart.addEventListener("click", startReview);
  }

  /* ------------------------------ Sesión -------------------------------- */
  function startSession(options = {}) {
    const config = {
      mode: options.mode || state.builder.mode,
      topic: options.topic || state.builder.topic,
      count: options.count == null ? state.builder.count : options.count,
      review: !!options.review
    };

    let pool;
    if (options.questions && options.questions.length) {
      pool = options.questions.slice();
    } else {
      pool =
        config.topic === "all"
          ? QUESTIONS.slice()
          : QUESTIONS.filter((q) => q.topic === config.topic);
    }
    if (!pool.length) return;

    let total;
    if (options.questions) total = pool.length;
    else if (config.count === "all") total = pool.length;
    else total = Math.min(Number(config.count) || 10, pool.length);

    const questions = shuffle(pool).slice(0, total);

    if (!config.review) {
      state.builder = {
        mode: config.mode,
        topic: config.topic,
        count: config.count
      };
    }

    state.session = {
      questions,
      answers: questions.map(() => null),
      index: 0,
      selection: null,
      draft: "",
      hintUsed: false,
      mode: config.mode,
      config,
      score: 0,
      streak: 0,
      bestStreak: 0,
      startedAt: Date.now(),
      finished: false,
      seconds: 0
    };

    setView("quiz");
    startTimer();
    renderQuiz("card");
  }

  function startReview() {
    const questions = Object.keys(state.progress.wrong)
      .map((id) => QUESTION_BY_ID[id])
      .filter(Boolean);
    if (!questions.length) return;
    startSession({
      mode: "practice",
      topic: "all",
      count: "all",
      questions: shuffle(questions),
      review: true
    });
  }

  function startTimer() {
    stopTimer();
    if (!state.session) return;
    updateTimer();
    timerId = window.setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimer() {
    const el = $("#quizTimer");
    if (!el || !state.session) return;
    el.textContent = formatTime((Date.now() - state.session.startedAt) / 1000);
  }

  function currentQuestion() {
    if (!state.session) return null;
    return state.session.questions[state.session.index];
  }

  function hasCurrentAnswer() {
    const q = currentQuestion();
    if (!q) return false;
    if (q.type === "mc") return state.session.selection !== null;
    return state.session.draft.trim() !== "" && !Number.isNaN(parseNumber(state.session.draft));
  }

  function answerIsCorrect(question, value) {
    if (question.type === "mc") return value === question.answer;
    const tolerance = question.tol == null ? 0.001 : question.tol;
    return Math.abs(Number(value) - question.answer) <= tolerance;
  }

  function correctAnswerText(question) {
    if (question.type === "mc") return question.options[question.answer];
    return `${formatNumber(question.answer, 4)}${question.unit ? " " + question.unit : ""}`;
  }

  function responseText(question, answer) {
    if (!answer || answer.value === null || answer.value === undefined) return "Sin responder";
    if (question.type === "mc") {
      return question.options[answer.value] == null ? "—" : question.options[answer.value];
    }
    return `${formatNumber(answer.value, 4)}${question.unit ? " " + question.unit : ""}`;
  }

  /* ------------------------------ Render quiz --------------------------- */
  function renderQuiz(focus) {
    const session = state.session;
    const card = $("#quizCard");
    if (!session || !card) return;

    const question = session.questions[session.index];
    const answer = session.answers[session.index];
    const answered = !!(answer && answer.checked);
    const practice = session.mode === "practice";
    const isLast = session.index === session.questions.length - 1;
    const total = session.questions.length;

    const topicEl = $("#quizTopic");
    const modeEl = $("#quizMode");
    if (topicEl) {
      topicEl.textContent = session.config.review
        ? "Repaso de fallos"
        : topicLabel(session.config.topic);
    }
    if (modeEl) modeEl.textContent = practice ? "Práctica" : "Examen";

    const counter = $("#quizCounter");
    if (counter) counter.textContent = `Pregunta ${session.index + 1} de ${total}`;

    const chips = $(".quiz-chips");
    if (chips) {
      chips.innerHTML = practice
        ? `<span class="chip">${session.score} pts</span>
           <span class="chip ${session.streak >= 3 ? "is-hot" : ""}">Racha ${session.streak}</span>`
        : `<span class="chip">Corrección al final</span>`;
    }

    const completed = answered ? session.index + 1 : session.index;
    const pct = Math.round((completed / total) * 100);
    const bar = $("#quizBar");
    if (bar) bar.style.width = `${pct}%`;
    const track = $("#quizTrack");
    if (track) track.setAttribute("aria-valuenow", String(pct));

    const answersHtml =
      question.type === "mc"
        ? `<div class="options" role="group" aria-label="Opciones de respuesta">
            ${question.options
              .map((option, index) => {
                let classes = "option";
                let disabled = "";
                if (answered) {
                  if (index === question.answer) classes += " is-correct";
                  else if (index === answer.value) classes += " is-wrong";
                  else classes += " is-dim";
                  disabled = "disabled";
                } else if (index === session.selection) {
                  classes += " is-selected";
                }
                return `<button type="button" class="${classes}" data-opt="${index}" aria-pressed="${index === session.selection}" ${disabled}>
                  <span class="option-key">${LETTERS[index] || index + 1}</span>
                  <span>${option}</span>
                </button>`;
              })
              .join("")}
          </div>`
        : `<div class="num-block">
            <div class="num-row">
              <input class="num-input" id="numAnswer" type="text" inputmode="decimal" autocomplete="off"
                placeholder="Escribí tu resultado" aria-label="Respuesta numérica"
                value="${escapeHtml(session.draft)}" ${answered ? "disabled" : ""}>
              ${question.unit ? `<span class="num-unit">${question.unit}</span>` : ""}
            </div>
            <p class="num-help" id="numHelp">Usá coma o punto decimal. También podés escribir una fracción, por ejemplo 3/8.</p>
          </div>`;

    const hintHtml =
      practice && !answered
        ? `<div class="hint-row">
             <button type="button" class="hint-btn" data-action="hint" ${session.hintUsed ? "disabled" : ""}>
               <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2a5.5 5.5 0 0 0-3.2 9.9c.5.4.8 1 .8 1.6v.5h4.8v-.5c0-.6.3-1.2.8-1.6A5.5 5.5 0 0 0 10 2Z"></path><path d="M8 17h4"></path></svg>
               Ver pista
             </button>
             <span class="hint-cost">${session.hintUsed ? "Pista usada · −40 pts" : "La pista resta 40 pts"}</span>
           </div>
           ${session.hintUsed ? `<div class="hint-box" id="hintBox" tabindex="-1"><strong>Fórmula de referencia</strong><code>${question.formula || defaultFormula(question.topic)}</code></div>` : ""}`
        : "";

    const feedbackHtml = answered
      ? `<div class="feedback ${answer.correct ? "" : "is-bad"}" id="feedback" tabindex="-1" role="status">
           <div class="feedback-head">
             <span class="feedback-icon" aria-hidden="true">
               ${
                 answer.correct
                   ? '<svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 10 4 4 8-8"></path></svg>'
                   : '<svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 5l10 10M15 5 5 15"></path></svg>'
               }
             </span>
             <h3>${answer.correct ? (answer.usedHint ? "Correcto, con pista" : "Correcto") : "No es correcto"}</h3>
             <span class="feedback-answer">Correcta: ${escapeHtml(correctAnswerText(question))}</span>
           </div>
           <p class="feedback-body">${question.explanation}</p>
           ${question.formula ? `<span class="feedback-formula">${question.formula}</span>` : ""}
         </div>`
      : "";

    let actionHtml;
    if (practice) {
      actionHtml = answered
        ? `<button type="button" class="btn btn-primary" data-action="next">${isLast ? "Ver resultados" : "Siguiente"}
             <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"></path></svg>
           </button>`
        : `<button type="button" class="btn btn-primary" data-action="check" ${hasCurrentAnswer() ? "" : "disabled"}>Comprobar</button>`;
    } else {
      actionHtml = `<button type="button" class="btn btn-primary" data-action="next" ${hasCurrentAnswer() ? "" : "disabled"}>${isLast ? "Finalizar" : "Siguiente"}</button>`;
    }

    const keyboardHtml =
      practice && !answered
        ? question.type === "mc"
          ? `<span class="keyboard-hint"><kbd>1</kbd>–<kbd>4</kbd> opciones · <kbd>Enter</kbd> comprobar</span>`
          : `<span class="keyboard-hint"><kbd>Enter</kbd> comprobar</span>`
        : `<span></span>`;

    card.innerHTML = `
      <div class="q-head">
        <span class="q-level" data-level="${question.level}"><i></i>${LEVELS[question.level] || "Práctica"}</span>
        <span class="q-type">${question.type === "mc" ? "Opción múltiple" : "Respuesta numérica"}</span>
      </div>
      <div class="q-prompt" id="qPrompt" tabindex="-1">${question.prompt}</div>
      ${answersHtml}
      ${hintHtml}
      ${feedbackHtml}
      <div class="quiz-actions">
        ${keyboardHtml}
        ${actionHtml}
      </div>`;

    const nextFocus = focus || "card";
    window.requestAnimationFrame(() => {
      if (nextFocus === "feedback") {
        const feedback = $("#feedback");
        if (feedback) feedback.focus({ preventScroll: true });
      } else if (nextFocus === "hint") {
        const hint = $("#hintBox");
        if (hint) hint.focus({ preventScroll: true });
      } else if (nextFocus === "option") {
        const selected = $(".option.is-selected");
        if (selected) selected.focus({ preventScroll: true });
      } else if (nextFocus === "input") {
        const input = $("#numAnswer");
        if (input) input.focus({ preventScroll: true });
      } else {
        const prompt = $("#qPrompt");
        if (prompt) prompt.focus({ preventScroll: true });
      }
    });
  }

  function selectOption(index) {
    const session = state.session;
    if (!session) return;
    const question = currentQuestion();
    const answer = session.answers[session.index];
    if (!question || question.type !== "mc") return;
    if (answer && answer.checked) return;
    session.selection = index;
    session.draft = "";
    renderQuiz("option");
  }

  function useHint() {
    const session = state.session;
    if (!session || session.mode !== "practice") return;
    const answer = session.answers[session.index];
    if (answer && answer.checked) return;
    session.hintUsed = true;
    renderQuiz("hint");
  }

  function checkAnswer() {
    const session = state.session;
    if (!session || session.mode !== "practice") return;
    const question = currentQuestion();
    const previous = session.answers[session.index];
    if (!question || (previous && previous.checked)) return;

    let value;
    let raw = "";
    if (question.type === "mc") {
      if (session.selection === null) return;
      value = session.selection;
      raw = String(session.selection);
    } else {
      raw = session.draft;
      value = parseNumber(raw);
      if (Number.isNaN(value)) {
        const help = $("#numHelp");
        if (help) {
          help.textContent = "No pudimos interpretar ese número. Probá con 0,375 o 3/8.";
          help.classList.add("is-error");
        }
        return;
      }
    }

    const correct = answerIsCorrect(question, value);
    const usedHint = !!session.hintUsed;
    const gained = correct
      ? Math.max(20, 100 + Math.min(session.streak * 10, 50) - (usedHint ? 40 : 0))
      : 0;

    session.answers[session.index] = {
      value,
      raw,
      correct,
      checked: true,
      usedHint
    };

    if (correct) {
      session.streak += 1;
      session.bestStreak = Math.max(session.bestStreak, session.streak);
      session.score += gained;
    } else {
      session.streak = 0;
    }

    recordAnswer(question, correct);
    renderQuiz("feedback");
  }

  function nextQuestion() {
    const session = state.session;
    if (!session) return;
    const question = currentQuestion();
    if (!question) return;

    if (session.mode === "exam") {
      if (!hasCurrentAnswer()) return;
      const value = question.type === "mc" ? session.selection : parseNumber(session.draft);
      session.answers[session.index] = {
        value,
        raw: session.draft,
        correct: false,
        checked: false,
        usedHint: false
      };
    } else {
      const answer = session.answers[session.index];
      if (!answer || !answer.checked) return;
    }

    if (session.index === session.questions.length - 1) {
      finishSession();
      return;
    }

    session.index += 1;
    session.selection = null;
    session.draft = "";
    session.hintUsed = false;
    renderQuiz("card");
  }

  function finishSession() {
    const session = state.session;
    if (!session || session.finished) return;
    session.finished = true;
    stopTimer();

    session.seconds = Math.max(1, Math.round((Date.now() - session.startedAt) / 1000));

    if (session.mode === "exam") {
      let streak = 0;
      let best = 0;
      let score = 0;
      session.questions.forEach((question, index) => {
        const answer = session.answers[index];
        const correct = !!answer && answerIsCorrect(question, answer.value);
        if (answer) {
          answer.correct = correct;
          answer.checked = true;
        } else {
          session.answers[index] = {
            value: null,
            raw: "",
            correct: false,
            checked: true,
            usedHint: false
          };
        }
        if (correct) {
          streak += 1;
          best = Math.max(best, streak);
          score += 100;
        } else {
          streak = 0;
        }
        recordAnswer(question, correct);
      });
      session.bestStreak = best;
      session.score = score;
    }

    const correct = session.answers.filter((answer) => answer && answer.correct).length;
    state.progress.sessions += 1;
    state.progress.bestStreak = Math.max(state.progress.bestStreak, session.bestStreak);
    state.progress.history.unshift({
      date: new Date().toISOString(),
      mode: session.mode,
      topic: session.config.topic,
      review: session.config.review,
      total: session.questions.length,
      correct,
      score: session.score,
      seconds: session.seconds
    });
    state.progress.history = state.progress.history.slice(0, 12);
    saveProgress();

    setView("results");
    renderResults();
  }

  /* ------------------------------ Resultados ---------------------------- */
  function renderResults() {
    const session = state.session;
    const container = $("#resultsContent");
    if (!session || !container) return;

    const total = session.questions.length;
    const correct = session.answers.filter((answer) => answer && answer.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;

    let headline;
    let subline;
    if (accuracy === 100) {
      headline = "Perfecto. Dominás este contenido.";
      subline = "Resolviste todo sin errores. Probá un tema distinto o subí la dificultad con una sesión mixta.";
    } else if (accuracy >= 85) {
      headline = "Muy buen trabajo.";
      subline = "Tenés una base sólida. Revisá los detalles de las preguntas falladas y volvé a intentarlo.";
    } else if (accuracy >= 70) {
      headline = "Vas por buen camino.";
      subline = "La mayoría de los conceptos están claros. Las explicaciones de los errores marcan qué conviene reforzar.";
    } else if (accuracy >= 50) {
      headline = "Buen punto de partida.";
      subline = "Hay conceptos para afianzar. Repasá las fórmulas y volvé a practicar los temas con menor dominio.";
    } else {
      headline = "Conviene repasar los conceptos.";
      subline = "No es un problema: mirá las resoluciones, usá las calculadoras para comprobar y volvé a intentar.";
    }

    const byTopic = new Map();
    session.questions.forEach((question, index) => {
      const answer = session.answers[index];
      const entry = byTopic.get(question.topic) || { total: 0, correct: 0 };
      entry.total += 1;
      if (answer && answer.correct) entry.correct += 1;
      byTopic.set(question.topic, entry);
    });

    const topicRows = TOPICS.filter((topic) => byTopic.has(topic.id))
      .map((topic) => {
        const entry = byTopic.get(topic.id);
        const pct = entry.total ? Math.round((entry.correct / entry.total) * 100) : 0;
        return `<div class="breakdown-row">
          <span class="breakdown-name">${topic.name}</span>
          <div class="track"><div class="track-fill" style="width:${pct}%"></div></div>
          <span class="breakdown-count">${entry.correct}/${entry.total}</span>
        </div>`;
      })
      .join("");

    const missed = session.questions
      .map((question, index) => ({ question, answer: session.answers[index] }))
      .filter((item) => !item.answer || !item.answer.correct);

    const reviewHtml = missed.length
      ? `<div class="review-list">
          ${missed
            .map(
              (item, index) => `
              <details class="review-item">
                <summary>
                  <span class="review-index">${String(index + 1).padStart(2, "0")}</span>
                  <div class="review-prompt">${item.question.prompt}</div>
                </summary>
                <div class="review-body">
                  <p class="review-answer is-bad">Tu respuesta: <strong>${escapeHtml(responseText(item.question, item.answer))}</strong></p>
                  <p class="review-answer is-good">Respuesta correcta: <strong>${escapeHtml(correctAnswerText(item.question))}</strong></p>
                  <p class="review-explanation">${item.question.explanation}</p>
                  ${item.question.formula ? `<span class="feedback-formula">${item.question.formula}</span>` : ""}
                </div>
              </details>`
            )
            .join("")}
        </div>`
      : `<div class="empty-state"><strong>Sin errores en esta sesión.</strong>No hay preguntas para repasar. Podés repetir la sesión o explorar otro tema.</div>`;

    const ringClass = accuracy < 50 ? "is-low" : accuracy < 75 ? "is-mid" : "";
    const modeLabel = session.mode === "practice" ? "Práctica" : "Examen";

    container.innerHTML = `
      <div class="results-shell">
        <div class="result-hero">
          <div class="score-ring ${ringClass}" id="scoreRing" role="img" aria-label="${accuracy}% de precisión">
            <svg viewBox="0 0 168 168" aria-hidden="true">
              <circle class="ring-track" cx="84" cy="84" r="72" fill="none" stroke-width="10"></circle>
              <circle class="ring-fill" cx="84" cy="84" r="72" fill="none" stroke-width="10"></circle>
            </svg>
            <div class="score-center"><strong>${accuracy}%</strong><span>precisión</span></div>
          </div>
          <div class="result-summary">
            <p class="kicker">Sesión completada</p>
            <h1>${headline}</h1>
            <p>${subline}</p>
            <div class="result-meta">
              <span>${total} preguntas</span>
              <span>${modeLabel}</span>
              <span>${formatTime(session.seconds)}</span>
              <span>Racha máx. ${session.bestStreak}</span>
            </div>
          </div>
        </div>

        <div class="result-stats">
          <div class="stat"><dt>Correctas</dt><dd>${correct}<small> / ${total}</small></dd></div>
          <div class="stat"><dt>Puntaje</dt><dd>${session.score}<small> pts</small></dd></div>
          <div class="stat"><dt>Tiempo</dt><dd>${formatTime(session.seconds)}</dd></div>
          <div class="stat"><dt>Mejor racha</dt><dd>${session.bestStreak}</dd></div>
        </div>

        <section class="result-section">
          <h2>Desempeño por tema</h2>
          <div class="breakdown">${topicRows}</div>
        </section>

        <section class="result-section">
          <h2>${missed.length ? `Para repasar (${missed.length})` : "Repaso"}</h2>
          ${reviewHtml}
        </section>

        <div class="result-actions">
          <button type="button" class="btn btn-primary" data-result-action="repeat">Repetir sesión</button>
          ${
            missed.length
              ? `<button type="button" class="btn btn-soft" data-result-action="review">${
                  missed.length === 1 ? "Practicar el fallo" : `Practicar los ${missed.length} fallos`
                }</button>`
              : ""
          }
          <button type="button" class="btn btn-ghost" data-result-action="home">Volver al inicio</button>
        </div>
      </div>`;

    const ring = $("#scoreRing");
    if (ring) {
      const circle = ring.querySelector(".ring-fill");
      if (circle) {
        const circumference = 2 * Math.PI * 72;
        circle.style.strokeDasharray = String(circumference);
        circle.style.strokeDashoffset = String(circumference);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            circle.style.strokeDashoffset = String(circumference * (1 - accuracy / 100));
          });
        });
      }
    }
  }

  function initResults() {
    if (!resultsView) return;
    resultsView.addEventListener("click", (event) => {
      const button = event.target.closest("[data-result-action]");
      if (!button) return;
      const action = button.dataset.resultAction;
      const session = state.session;
      if (!session) return;

      if (action === "repeat") {
        const config = { ...session.config };
        if (config.review) startReview();
        else startSession(config);
      } else if (action === "review") {
        const missed = session.questions.filter(
          (question, index) => !session.answers[index] || !session.answers[index].correct
        );
        if (missed.length) {
          startSession({
            mode: "practice",
            topic: "all",
            count: "all",
            questions: missed,
            review: true
          });
        }
      } else if (action === "home") {
        setView("home");
      }
    });
  }

  /* ------------------------------ Progreso ------------------------------ */
  function renderProgress() {
    const container = $("#progressContent");
    if (!container) return;
    const p = state.progress;
    const accuracy = p.answered ? Math.round((p.correct / p.answered) * 100) : 0;

    const masteryRows = TOPICS.map((topic) => {
      const stats = p.topics[topic.id] || { seen: 0, correct: 0 };
      const pct = stats.seen ? Math.round((stats.correct / stats.seen) * 100) : 0;
      return `<div class="mastery-row">
        <span class="mastery-name">${topic.name}</span>
        <div class="track"><div class="track-fill" style="width:${pct}%"></div></div>
        <span class="mastery-value">${stats.seen ? `${stats.correct}/${stats.seen}` : "—"}</span>
      </div>`;
    }).join("");

    const historyHtml = p.history.length
      ? `<div class="history-list">
          ${p.history
            .map((entry) => {
              const pct = entry.total ? Math.round((entry.correct / entry.total) * 100) : 0;
              const date = new Date(entry.date);
              const dateLabel = Number.isNaN(date.getTime())
                ? ""
                : date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
              const title = entry.review ? "Repaso de fallos" : topicLabel(entry.topic);
              return `<div class="history-item">
                <div class="history-main">
                  <strong>${title}</strong>
                  <span>${dateLabel} · ${entry.correct}/${entry.total} correctas</span>
                </div>
                <span class="history-score ${pct < 60 ? "is-low" : ""}">${pct}%</span>
              </div>`;
            })
            .join("")}
        </div>`
      : `<div class="empty-state"><strong>Todavía no hay sesiones.</strong>Cuando termines una práctica, acá vas a ver tu historial y tu precisión.</div>`;

    container.innerHTML = `
      <div class="page-head">
        <p class="kicker">Tu recorrido</p>
        <h1>Progreso</h1>
        <p class="page-lead">El avance se guarda automáticamente en este navegador. No se envía a ningún servidor.</p>
      </div>

      <div class="progress-stats">
        <div class="stat"><dt>Respondidas</dt><dd>${p.answered}</dd></div>
        <div class="stat"><dt>Precisión</dt><dd>${accuracy}%</dd></div>
        <div class="stat"><dt>Mejor racha</dt><dd>${p.bestStreak}</dd></div>
        <div class="stat"><dt>Sesiones</dt><dd>${p.sessions}</dd></div>
      </div>

      <div class="progress-grid">
        <section class="panel">
          <div class="panel-head"><h2>Dominio por tema</h2><span>correctas / vistas</span></div>
          ${masteryRows}
        </section>
        <section class="panel">
          <div class="panel-head"><h2>Últimas sesiones</h2><span>${p.history.length}/12</span></div>
          ${historyHtml}
        </section>
      </div>

      <div class="progress-actions">
        <p>Los fallos se guardan para el modo “Repasar fallos”.</p>
        <button type="button" class="btn btn-danger" data-progress-action="reset">Borrar progreso</button>
      </div>`;
  }

  function initProgress() {
    if (!progressView) return;
    progressView.addEventListener("click", (event) => {
      const button = event.target.closest("[data-progress-action]");
      if (!button) return;
      if (button.dataset.progressAction === "reset") {
        confirmDialog({
          title: "¿Borrar todo el progreso?",
          message: "Se eliminarán las estadísticas, el historial y las preguntas guardadas para repaso. Esta acción no se puede deshacer.",
          confirmLabel: "Borrar",
          danger: true
        }).then((ok) => {
          if (!ok) return;
          try {
            localStorage.removeItem(STORE_KEY);
          } catch (err) { /* sin persistencia */ }
          state.progress = emptyProgress();
          renderProgress();
          renderHome();
        });
      }
    });
  }

  /* ------------------------------ Fórmulas ------------------------------ */
  function renderFormulas() {
    const container = $("#formulasContent");
    if (!container) return;

    const groups = FORMULAS.map((group, index) => {
      const topic = TOPIC_BY_ID[group.topic];
      return `<section class="formula-group">
        <div class="formula-group-head">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h2>${group.title}</h2>
        </div>
        <div class="formula-grid">
          ${group.items
            .map(
              (item) => `<article class="formula-card">
                <h3>${item.name}</h3>
                <div class="formula-expression">${item.formula}</div>
                <p>${item.note}</p>
              </article>`
            )
            .join("")}
        </div>
        ${topic ? `<p class="mono" style="margin-top:10px;color:var(--faint);font-size:.66rem">${topic.source}</p>` : ""}
      </section>`;
    }).join("");

    const zRows = Z_VALUES.map((row) => `<tr><td>${row.z}</td><td>${row.p}</td></tr>`).join("");

    container.innerHTML = `
      <div class="formula-intro">
        <div class="page-head" style="padding-top:0">
          <p class="kicker">Referencia rápida</p>
          <h1>Formulario</h1>
          <p class="page-lead">Las fórmulas que aparecen en el juego, ordenadas por tema. Usalas como pista y como checklist antes de una evaluación.</p>
        </div>
        <aside class="z-quick" aria-label="Valores frecuentes de la normal estándar">
          <h3>Normal estándar · Φ(z)</h3>
          <table>
            <thead><tr><th>z</th><th>Φ(z)</th></tr></thead>
            <tbody>${zRows}</tbody>
          </table>
        </aside>
      </div>
      ${groups}`;
  }

  /* ------------------------------ Calculadoras -------------------------- */
  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    const kk = Math.min(k, n - k);
    let result = 1;
    for (let i = 1; i <= kk; i++) {
      result = (result * (n - kk + i)) / i;
    }
    return result;
  }

  function logGamma(z) {
    const g = 7;
    const coef = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    if (z < 0.5) {
      return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
    }
    z -= 1;
    let x = coef[0];
    for (let i = 1; i < g + 2; i++) x += coef[i] / (z + i);
    const t = z + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }

  function poissonPmf(lambda, k) {
    if (k < 0) return 0;
    return Math.exp(k * Math.log(lambda) - lambda - logGamma(k + 1));
  }

  function erf(x) {
    const sign = x < 0 ? -1 : 1;
    const ax = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * ax);
    const y =
      1 -
      ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
        0.254829592) *
        t *
        Math.exp(-ax * ax);
    return sign * y;
  }

  function normalCdf(z) {
    return 0.5 * (1 + erf(z / Math.SQRT2));
  }

  function numValue(id) {
    const el = document.getElementById(id);
    if (!el) return NaN;
    if (el.value === "") return NaN;
    return Number(el.value);
  }

  function calculateBinomial() {
    const n = Math.round(numValue("binN"));
    const p = numValue("binP");
    const k = Math.round(numValue("binK"));
    const note = $("#binNote");
    const valid =
      Number.isFinite(n) && n >= 1 && n <= 300 &&
      Number.isFinite(p) && p >= 0 && p <= 1 &&
      Number.isFinite(k) && k >= 0 && k <= n;

    if (!valid) {
      ["binPk", "binPle", "binPge", "binStats"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "—";
      });
      if (note) note.textContent = "Revisá los valores: n entero entre 1 y 300, 0 ≤ p ≤ 1 y 0 ≤ k ≤ n.";
      return;
    }

    const pmf = (x) => {
      if (p === 0) return x === 0 ? 1 : 0;
      if (p === 1) return x === n ? 1 : 0;
      return comb(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
    };

    const pk = pmf(k);
    let cdf = 0;
    for (let x = 0; x <= k; x++) cdf += pmf(x);
    const ple = Math.min(1, Math.max(0, cdf));
    const pge = Math.min(1, Math.max(0, 1 - (cdf - pk)));

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set("binPk", formatProbability(pk));
    set("binPle", formatProbability(ple));
    set("binPge", formatProbability(pge));
    set(
      "binStats",
      `μ = ${formatNumber(n * p, 2)} · σ = ${formatNumber(Math.sqrt(n * p * (1 - p)), 4)}`
    );
    if (note) note.textContent = `X ~ Bin(${n}; ${formatNumber(p, 2)}). La media y la desviación estándar usan np y √(np(1−p)).`;
  }

  function calculatePoisson() {
    const lambda = numValue("poiL");
    const k = Math.round(numValue("poiK"));
    const note = $("#poiNote");
    const valid =
      Number.isFinite(lambda) && lambda > 0 && lambda <= 200 &&
      Number.isFinite(k) && k >= 0 && k <= 200;

    if (!valid) {
      ["poiPk", "poiPle", "poiPge", "poiStats"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "—";
      });
      if (note) note.textContent = "Revisá los valores: λ > 0 y k entero no negativo.";
      return;
    }

    const pk = poissonPmf(lambda, k);
    let cdf = 0;
    for (let x = 0; x <= k; x++) cdf += poissonPmf(lambda, x);
    const ple = Math.min(1, Math.max(0, cdf));
    const pge = Math.min(1, Math.max(0, 1 - (cdf - pk)));

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set("poiPk", formatProbability(pk));
    set("poiPle", formatProbability(ple));
    set("poiPge", formatProbability(pge));
    set("poiStats", `μ = ${formatNumber(lambda, 2)} · σ = ${formatNumber(Math.sqrt(lambda), 4)}`);
    if (note) note.textContent = `X ~ Poisson(${formatNumber(lambda, 2)}). En Poisson, media y varianza coinciden con λ.`;
  }

  function calculateNormal() {
    const mu = numValue("norMu");
    const sigma = numValue("norSigma");
    const mode = $("#norMode") ? $("#norMode").value : "le";
    const x = numValue("norX");
    const b = numValue("norB");
    const note = $("#norNote");
    const resultEl = $("#norResult");
    const zEl = $("#norZ");
    const bWrap = $("#norBWrap");
    const xLabel = $("#norXLabel");

    if (bWrap) bWrap.hidden = mode !== "between";
    if (xLabel) xLabel.textContent = mode === "between" ? "a" : "x";

    const validBase = Number.isFinite(mu) && Number.isFinite(sigma) && sigma > 0;
    let valid = validBase;
    if (mode === "between") valid = valid && Number.isFinite(x) && Number.isFinite(b);
    else valid = valid && Number.isFinite(x);

    if (!valid) {
      if (resultEl) resultEl.textContent = "—";
      if (zEl) zEl.textContent = "—";
      if (note) note.textContent = "Revisá los valores: σ debe ser mayor que 0.";
      return;
    }

    let probability;
    let zText;
    if (mode === "between") {
      const lo = Math.min(x, b);
      const hi = Math.max(x, b);
      const zLo = (lo - mu) / sigma;
      const zHi = (hi - mu) / sigma;
      probability = normalCdf(zHi) - normalCdf(zLo);
      zText = `${formatNumber(zLo, 4)} y ${formatNumber(zHi, 4)}`;
    } else {
      const z = (x - mu) / sigma;
      probability = mode === "le" ? normalCdf(z) : 1 - normalCdf(z);
      zText = formatNumber(z, 4);
    }

    if (resultEl) resultEl.textContent = formatProbability(probability);
    if (zEl) zEl.textContent = zText;
    if (note) {
      note.textContent =
        mode === "between"
          ? `P(${formatNumber(Math.min(x, b), 2)} ≤ X ≤ ${formatNumber(Math.max(x, b), 2)}) con X ~ N(${formatNumber(mu, 2)}; ${formatNumber(sigma, 2)}).`
          : `P(X ${mode === "le" ? "≤" : "≥"} ${formatNumber(x, 2)}) con X ~ N(${formatNumber(mu, 2)}; ${formatNumber(sigma, 2)}).`;
    }
  }

  function calculateIndices() {
    const rows = [0, 1, 2].map((row) => {
      const get = (field) => {
        const el = document.querySelector(`.idx[data-row="${row}"][data-p="${field}"]`);
        if (!el || el.value === "") return 0;
        const value = Number(el.value);
        return Number.isFinite(value) ? value : 0;
      };
      return { p0: get("p0"), q0: get("q0"), p1: get("p1"), q1: get("q1") };
    });

    const sP0Q0 = rows.reduce((acc, r) => acc + r.p0 * r.q0, 0);
    const sP1Q0 = rows.reduce((acc, r) => acc + r.p1 * r.q0, 0);
    const sP0Q1 = rows.reduce((acc, r) => acc + r.p0 * r.q1, 0);
    const sP1Q1 = rows.reduce((acc, r) => acc + r.p1 * r.q1, 0);

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    set("idxLP", sP0Q0 ? formatFixed((sP1Q0 / sP0Q0) * 100) : "—");
    set("idxPP", sP0Q1 ? formatFixed((sP1Q1 / sP0Q1) * 100) : "—");
    set("idxLQ", sP0Q0 ? formatFixed((sP0Q1 / sP0Q0) * 100) : "—");
    set("idxPQ", sP1Q0 ? formatFixed((sP1Q1 / sP1Q0) * 100) : "—");
    set("idxV", sP0Q0 ? formatFixed((sP1Q1 / sP0Q0) * 100) : "—");

    const note = $("#idxNote");
    if (note) {
      note.textContent =
        sP0Q0 && sP0Q1 && sP1Q0
          ? `Σp₀q₀ = ${formatFixed(sP0Q0)} · Σp₁q₀ = ${formatFixed(sP1Q0)} · Σp₀q₁ = ${formatFixed(sP0Q1)} · Σp₁q₁ = ${formatFixed(sP1Q1)}`
          : "Faltan datos: algunas sumas son cero, así que ciertos índices no se pueden calcular.";
    }
  }

  function calculateAllTools() {
    if (!toolsView) return;
    calculateBinomial();
    calculatePoisson();
    calculateNormal();
    calculateIndices();
  }

  function initTools() {
    if (!toolsView) return;
    ["binN", "binP", "binK"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", calculateBinomial);
    });
    ["poiL", "poiK"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", calculatePoisson);
    });
    ["norMu", "norSigma", "norX", "norB"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", calculateNormal);
    });
    const mode = $("#norMode");
    if (mode) mode.addEventListener("change", calculateNormal);
    $$(".idx").forEach((input) => input.addEventListener("input", calculateIndices));
  }

  /* ------------------------------ Eventos quiz -------------------------- */
  function initQuiz() {
    if (!quizView) return;

    quizView.addEventListener("click", (event) => {
      const option = event.target.closest(".option");
      if (option && !option.disabled) {
        selectOption(Number(option.dataset.opt));
        return;
      }
      const actionEl = event.target.closest("[data-action]");
      if (!actionEl) return;
      const action = actionEl.dataset.action;
      if (action === "exit") {
        navigate("home");
      } else if (action === "check") {
        checkAnswer();
      } else if (action === "next") {
        nextQuestion();
      } else if (action === "hint") {
        useHint();
      }
    });

    quizView.addEventListener("input", (event) => {
      if (!event.target.matches("#numAnswer")) return;
      const session = state.session;
      if (!session) return;
      session.draft = event.target.value;
      session.selection = null;

      const help = $("#numHelp");
      if (help) {
        const raw = session.draft.trim();
        if (raw && Number.isNaN(parseNumber(raw))) {
          help.textContent = "No pudimos interpretar ese número. Probá con 0,375 o 3/8.";
          help.classList.add("is-error");
        } else {
          help.textContent = "Usá coma o punto decimal. También podés escribir una fracción, por ejemplo 3/8.";
          help.classList.remove("is-error");
        }
      }

      const button = $('[data-action="check"], [data-action="next"]', quizView);
      if (button) button.disabled = !hasCurrentAnswer();
    });

    document.addEventListener("keydown", (event) => {
      if (state.view !== "quiz" || !state.session || state.session.finished) return;
      if (dialog && dialog.open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        navigate("home");
        return;
      }

      const session = state.session;
      const question = currentQuestion();
      if (!question) return;
      const answer = session.answers[session.index];
      const answered = !!(answer && answer.checked);

      const target = event.target;
      const isTyping =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT");

      if (event.key === "Enter") {
        if (isTyping && target.tagName !== "INPUT") return;
        if (!quizView.contains(target) && target !== document.body) return;
        if (target && target.closest && target.closest('a, [data-action="exit"], [data-action="hint"]')) return;
        event.preventDefault();
        if (session.mode === "practice") {
          if (answered) nextQuestion();
          else checkAnswer();
        } else {
          nextQuestion();
        }
        return;
      }

      if (isTyping) return;

      if (question.type === "mc" && /^[1-9]$/.test(event.key)) {
        const index = Number(event.key) - 1;
        if (index < question.options.length) {
          event.preventDefault();
          selectOption(index);
        }
        return;
      }

      if (event.key.toLowerCase() === "h" && session.mode === "practice" && !answered) {
        event.preventDefault();
        useHint();
      }
    });
  }

  /* ------------------------------ Arranque ------------------------------ */
  function init() {
    initTheme();
    initDialog();
    initBuilder();
    initHome();
    initQuiz();
    initResults();
    initProgress();
    initTools();

    $$("[data-nav]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        navigate(element.dataset.nav);
      });
    });

    renderHome();
    setView("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
