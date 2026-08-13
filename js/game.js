(() => {
  "use strict";

  const TEXT = window.GAME_TEXT;
  const CONFIG = window.GAME_CONFIG;

  if (!TEXT || !CONFIG) {
    throw new Error("GAME_TEXT または GAME_CONFIG が読み込まれていません。");
  }

  const stage = document.getElementById("stage");
  const backdrop = document.getElementById("backdrop");
  const flash = document.getElementById("flash");
  const systemAlert = document.getElementById("systemAlert");
  const homeBtn = document.getElementById("homeBtn");
  const collectionBtn = document.getElementById("collectionBtn");
  const gorillaMeter = document.getElementById("gorillaMeter");
  const brand = document.getElementById("brand");

  let state = freshState();

  function freshState() {
    return {
      name: "あなた",
      index: 0,
      score: {
        therapist: {nayuta: 0, gorilla: 0},
        route: {date: 0, love: 0, adult: 0}
      },
      tie: {therapist: "nayuta", route: "love"},
      gorillaSecret: 0,
      result: null
    };
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[char]));
  }

  function htmlText(value) {
    return esc(value).replace(/\n/g, "<br>");
  }

  function template(value, vars = {}) {
    let out = String(value ?? "");
    Object.entries(vars).forEach(([key, val]) => {
      out = out.replaceAll(`{${key}}`, String(val));
    });
    return out;
  }

  function calledName() {
    return state.name === "あなた" ? "ハニー" : state.name;
  }

  function personalize(value) {
    return String(value ?? "").replaceAll("○○", calledName());
  }

  function setBg(url, pos = "center") {
    if (!url) {
      backdrop.style.backgroundImage = "";
      backdrop.style.backgroundPosition = "center";
      return;
    }
    backdrop.style.backgroundImage = `url("${url}")`;
    backdrop.style.backgroundPosition = pos;
  }

  function getFound() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]");
    } catch {
      return [];
    }
  }

  function saveEnding(id) {
    const list = getFound();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(list));
    }
  }

  function foundSummary() {
    return `発見済み END：${getFound().length} / ${CONFIG.endingOrder.length}`;
  }

  function gorillaLevel() {
    const g = state.score.therapist.gorilla || 0;
    const n = state.score.therapist.nayuta || 0;
    const total = Math.max(1, g + n);
    return Math.min(100, Math.round((g / total) * 100));
  }

  function updateCorruption() {
    const level = gorillaLevel();

    if (state.index >= 3 && level >= 55) {
      gorillaMeter.hidden = false;
      gorillaMeter.textContent = `GORILLA LEVEL ${level}%`;
      brand.textContent = level >= 75 ? "SYSTEM // GORILLA" : TEXT.ui.brand;
    } else {
      gorillaMeter.hidden = true;
      brand.textContent = TEXT.ui.brand;
    }
  }

  function showAlert(message, duration = 1400) {
    systemAlert.innerHTML = htmlText(message);
    systemAlert.classList.add("on");
    setTimeout(() => systemAlert.classList.remove("on"), duration);
  }

  function getTherapistText(id) {
    return TEXT[id];
  }

  function getEndingConfig(therapist, route) {
    return CONFIG.therapists[therapist].endings[route];
  }

  function getEndingText(therapist, route) {
    return TEXT[therapist][route];
  }

  function startScreen() {
    state = freshState();
    homeBtn.hidden = true;
    gorillaMeter.hidden = true;
    brand.textContent = TEXT.ui.brand;
    setBg(null);

    stage.innerHTML = `
      <section class="card center">
        <div class="kicker">${esc(TEXT.ui.titleKicker)}</div>
        <h1 class="title">${htmlText(TEXT.ui.title)}</h1>
        <p class="lead">${htmlText(TEXT.ui.titleLead)}</p>
        <div class="collection-summary">${esc(foundSummary())}</div>
        <div class="actions">
          <button class="btn primary" id="startBtn">${esc(TEXT.ui.start)}</button>
          <button class="btn" id="collectionStartBtn">${esc(TEXT.ui.viewCollection)}</button>
        </div>
      </section>`;

    document.getElementById("startBtn").onclick = nameScreen;
    document.getElementById("collectionStartBtn").onclick = collectionScreen;
  }

  function nameScreen() {
    homeBtn.hidden = false;

    stage.innerHTML = `
      <section class="card">
        <div class="kicker">${esc(TEXT.ui.nameKicker)}</div>
        <h2 class="question">${htmlText(TEXT.ui.nameQuestion)}</h2>
        <p class="muted">${htmlText(TEXT.ui.nameHelp)}</p>
        <input id="nameInput" class="name-input" maxlength="12" placeholder="${esc(TEXT.ui.namePlaceholder)}">
        <div class="actions">
          <button class="btn primary" id="nameGo">${esc(TEXT.ui.nameSubmit)}</button>
          <button class="btn" id="skipName">${esc(TEXT.ui.nameSkip)}</button>
        </div>
      </section>`;

    const input = document.getElementById("nameInput");

    const go = () => {
      state.name = input.value.trim() || "あなた";
      questionScreen();
    };

    document.getElementById("nameGo").onclick = go;
    document.getElementById("skipName").onclick = () => {
      state.name = "あなた";
      questionScreen();
    };

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") go();
    });

    input.focus();
  }

  function progressHtml() {
    return `<div class="progress">${
      CONFIG.questions.map((_, i) => `<i class="${i <= state.index ? "on" : ""}"></i>`).join("")
    }</div>`;
  }

  function questionScreen() {
    setBg(null);
    updateCorruption();

    const qConfig = CONFIG.questions[state.index];
    const qText = TEXT.questions[qConfig.id];
    const corrupt = gorillaLevel() >= 75 && state.index >= 4;

    stage.innerHTML = `
      <section class="card ${corrupt ? "system-corrupt" : ""}">
        ${progressHtml()}
        <div class="kicker">${
          corrupt ? "GORILLA DIAGNOSTIC" : `QUESTION ${state.index + 1} / ${CONFIG.questions.length}`
        }</div>
        <h2 class="question">${htmlText(qText.text)}</h2>
        ${qText.sub ? `<p class="muted">${htmlText(qText.sub)}</p>` : ""}
        <div class="actions" id="choices"></div>
      </section>`;

    const wrap = document.getElementById("choices");

    qConfig.choices.forEach(choiceConfig => {
      const button = document.createElement("button");
      button.className = "choice" + (choiceConfig.gorillaSecret ? " gorilla-choice" : "");
      button.textContent = qText.choices[choiceConfig.id];
      button.onclick = () => choose(choiceConfig);
      wrap.appendChild(button);
    });
  }

  function addScores(target, scores) {
    if (!scores) return;
    Object.entries(scores).forEach(([key, val]) => {
      target[key] = (target[key] || 0) + val;
    });
  }

  function choose(choice) {
    addScores(state.score.therapist, choice.scores?.therapist);
    addScores(state.score.route, choice.scores?.route);

    state.gorillaSecret += choice.gorillaSecret || 0;

    if (choice.tie?.therapist) state.tie.therapist = choice.tie.therapist;
    if (choice.tie?.route) state.tie.route = choice.tie.route;

    const level = gorillaLevel();

    if (state.index >= 4 && level >= 82 && state.gorillaSecret >= 6) {
      showAlert(TEXT.ui.systemWarning);
    }

    state.index++;

    if (state.index < CONFIG.questions.length) {
      questionScreen();
    } else {
      preReveal();
    }
  }

  function maxKey(obj, fallback) {
    const entries = Object.entries(obj);
    const max = Math.max(...entries.map(([, value]) => value));
    const winners = entries.filter(([, value]) => value === max).map(([key]) => key);

    return winners.length === 1
      ? winners[0]
      : (winners.includes(fallback) ? fallback : winners[0]);
  }

  function resolveResult() {
    const therapist = maxKey(state.score.therapist, state.tie.therapist);
    const route = maxKey(state.score.route, state.tie.route);

    const secret =
      therapist === "gorilla" &&
      state.gorillaSecret >= CONFIG.secretCondition.minimumSecretPoints &&
      state.score.therapist.gorilla >= CONFIG.secretCondition.minimumGorillaPoints;

    return secret
      ? {therapist: "gorilla", route: "true"}
      : {therapist, route};
  }

  function preReveal() {
    state.result = resolveResult();

    if (state.result.route === "true") {
      brand.textContent = "SYSTEM // OVERRIDDEN";
      gorillaMeter.hidden = false;
      gorillaMeter.textContent = "GORILLA LEVEL 100%";

      stage.innerHTML = `
        <section class="card center system-corrupt">
          <div class="kicker corrupt-text">${esc(TEXT.ui.systemErrorKicker)}</div>
          <h2 class="title">${htmlText(TEXT.ui.systemErrorTitle)}</h2>
          <p class="lead">${htmlText(TEXT.ui.systemErrorLead)}</p>
          <div class="actions">
            <button class="btn primary" id="continueSecret">${esc(TEXT.ui.systemContinue)}</button>
          </div>
        </section>`;

      document.getElementById("continueSecret").onclick = () => {
        showAlert(TEXT.ui.systemOverride, 900);
        setTimeout(normalPreReveal, 700);
      };

      return;
    }

    normalPreReveal();
  }

  function normalPreReveal() {
    setBg(null);

    stage.innerHTML = `
      <section class="card center">
        <div class="kicker">${esc(TEXT.ui.resultKicker)}</div>
        <div class="reveal-dots">…</div>
        <h2 class="title">${htmlText(template(TEXT.ui.resultTitle, {name: state.name}))}</h2>
        <p class="lead">${htmlText(TEXT.ui.resultLead)}</p>
        <div class="actions">
          <button class="btn primary" id="revealBtn">${esc(TEXT.ui.revealButton)}</button>
        </div>
      </section>`;

    document.getElementById("revealBtn").onclick = dramaticReveal;
  }

  function dramaticReveal() {
    flash.classList.add("on");

    setTimeout(() => {
      if (state.result.therapist === "gorilla") {
        startGorillaEnding();
      } else {
        revealNayutaEnding();
      }

      setTimeout(() => flash.classList.remove("on"), 150);
    }, 580);
  }

  function revealNayutaEnding() {
    const tConfig = CONFIG.therapists.nayuta;
    const tText = TEXT.nayuta;
    const eConfig = getEndingConfig("nayuta", state.result.route);
    const eText = getEndingText("nayuta", state.result.route);

    saveEnding(eConfig.id);
    setBg(eConfig.image, eConfig.position);

    stage.innerHTML = `
      <section class="card center">
        <div class="ending-count">${esc(eText.label)}</div>
        <div class="result-name">${esc(tText.name)}</div>
        <div class="result-route">${esc(eText.routeLabel)}</div>
        <p class="lead">${htmlText(personalize(eText.line))}</p>
        <p class="muted">${htmlText(eText.body)}</p>
        ${finalActions("nayuta")}
      </section>`;

    bindFinalActions("nayuta");
  }

  function startGorillaEnding() {
    const route = state.result.route;
    const eConfig = getEndingConfig("gorilla", route);
    setBg(eConfig.image, eConfig.position);

    if (route === "date") gorillaDate1();
    else if (route === "love") gorillaLove1();
    else if (route === "adult") gorillaDark1();
    else gorillaTrue1();
  }

  // -------------------------------------------------------
  // GORILLA DATE
  // -------------------------------------------------------
  function gorillaDate1() {
    const t = TEXT.gorilla.date;

    stage.innerHTML = `
      <section class="card">
        <div class="speaker">${esc(TEXT.gorilla.name)}</div>
        <div class="dialogue">${htmlText(t.opening)}</div>
        <div class="actions">
          <button class="choice" id="gd1">${esc(t.openingChoice)}</button>
        </div>
      </section>`;

    document.getElementById("gd1").onclick = gorillaDate2;
  }

  function gorillaDate2() {
    const t = TEXT.gorilla.date;

    stage.innerHTML = `
      <section class="card">
        <div class="speaker">${esc(TEXT.gorilla.name)}</div>
        <div class="dialogue">${htmlText(t.plan)}</div>
        <div class="actions">
          <button class="choice" id="gd2">${esc(t.planChoice)}</button>
        </div>
      </section>`;

    document.getElementById("gd2").onclick = gorillaDate3;
  }

  function gorillaDate3() {
    const t = TEXT.gorilla.date;

    stage.innerHTML = `
      <section class="card">
        <div class="speaker">${esc(TEXT.gorilla.name)}</div>
        <div class="dialogue">${htmlText(t.collar)}</div>
        <div class="actions">
          <button class="choice" data-answer="wait">${esc(t.collarChoices.wait)}</button>
          <button class="choice" data-answer="why">${esc(t.collarChoices.why)}</button>
          <button class="choice gorilla-choice" data-answer="black">${esc(t.collarChoices.black)}</button>
        </div>
      </section>`;

    stage.querySelectorAll("[data-answer]").forEach(button => {
      button.onclick = () => {
        const answer = button.dataset.answer;
        finishGorilla("date", t.collarReplies[answer], t.footer);
      };
    });
  }

  // -------------------------------------------------------
  // GORILLA LOVE
  // -------------------------------------------------------
  function gorillaLove1() {
    const t = TEXT.gorilla.love;

    stage.innerHTML = `
      <section class="card">
        <div class="speaker">${esc(TEXT.gorilla.name)}</div>
        <div class="dialogue">${htmlText(t.opening)}</div>
        <div class="actions">
          <button class="choice" data-love="hand">${esc(t.guesses.hand)}</button>
          <button class="choice" data-love="hug">${esc(t.guesses.hug)}</button>
          <button class="choice" data-love="kiss">${esc(t.guesses.kiss)}</button>
        </div>
      </section>`;

    stage.querySelectorAll("[data-love]").forEach(button => {
      button.onclick = gorillaLove2;
    });
  }

  function gorillaLove2() {
    const t = TEXT.gorilla.love;

    stage.innerHTML = `
      <section class="card center">
        <div class="kicker">${esc(t.revealKicker)}</div>
        <h2 class="title">${htmlText(t.reveal)}</h2>
        <div class="actions">
          <button class="choice" data-arm="fight">${esc(t.armChoices.fight)}</button>
          <button class="choice" data-arm="lose">${esc(t.armChoices.lose)}</button>
          <button class="choice" data-arm="no">${esc(t.armChoices.no)}</button>
        </div>
      </section>`;

    stage.querySelectorAll("[data-arm]").forEach(button => {
      button.onclick = () => {
        gorillaLove3(t.armReplies[button.dataset.arm]);
      };
    });
  }

  function gorillaLove3(reply) {
    const t = TEXT.gorilla.love;

    stage.innerHTML = `
      <section class="card">
        <div class="speaker">${esc(TEXT.gorilla.name)}</div>
        <div class="dialogue">${htmlText(reply)}<br><br>${htmlText(t.closing)}</div>
        <div class="actions">
          <button class="btn primary" id="glEnd">${esc(t.endButton)}</button>
        </div>
      </section>`;

    document.getElementById("glEnd").onclick = () => {
      finishGorilla("love", "", t.footer);
    };
  }

  // -------------------------------------------------------
  // GORILLA DARK
  // -------------------------------------------------------
  function gorillaDark1() {
    const t = TEXT.gorilla.adult;

    stage.innerHTML = `
      <section class="card">
        <div class="speaker">${esc(TEXT.gorilla.name)}</div>
        <div class="dialogue">${htmlText(t.opening)}</div>
        <div class="actions">
          <button class="choice" data-dark="ok">${esc(t.choices.ok)}</button>
          <button class="choice" data-dark="nervous">${esc(t.choices.nervous)}</button>
          <button class="choice gorilla-choice" data-dark="leave">${esc(t.choices.leave)}</button>
        </div>
      </section>`;

    stage.querySelectorAll("[data-dark]").forEach(button => {
      button.onclick = gorillaDark2;
    });
  }

  function gorillaDark2() {
    const t = TEXT.gorilla.adult;

    flash.classList.add("on");

    setTimeout(() => {
      flash.classList.remove("on");

      stage.innerHTML = `
        <section class="card">
          <div class="kicker corrupt-text">${esc(t.itemKicker)}</div>
          <div class="item-card">
            <div class="item-title">${esc(t.itemCategory)}</div>
            <div class="item-name">${esc(t.itemName)}</div>
            <div class="item-stats">${htmlText(t.itemStats)}</div>
          </div>
          <div class="actions">
            <button class="choice" data-item="equip">${esc(t.itemChoices.equip)}</button>
            <button class="choice" data-item="info">${esc(t.itemChoices.info)}</button>
            <button class="choice" data-item="drop">${esc(t.itemChoices.drop)}</button>
          </div>
        </section>`;

      stage.querySelectorAll("[data-item]").forEach(button => {
        button.onclick = () => {
          const answer = button.dataset.item;

          if (answer === "info") {
            gorillaDark2();
            return;
          }

          finishGorilla("adult", t.itemReplies[answer], t.footer);
        };
      });
    }, 550);
  }

  // -------------------------------------------------------
  // GORILLA TRUE
  // -------------------------------------------------------
  function gorillaTrue1() {
    const t = TEXT.gorilla.true;

    brand.textContent = "GORILLA SYSTEM";
    gorillaMeter.hidden = false;
    gorillaMeter.textContent = "GORILLA LEVEL 100%";

    stage.innerHTML = `
      <section class="card center system-corrupt">
        <div class="kicker corrupt-text">${esc(t.kicker)}</div>
        <h2 class="title">${esc(t.label)}</h2>
        <p class="lead">${htmlText(t.opening)}</p>
        <div class="actions">
          <button class="btn primary" id="gt1">${esc(t.continueButton)}</button>
        </div>
      </section>`;

    document.getElementById("gt1").onclick = () => {
      stage.innerHTML = `
        <section class="card center system-corrupt">
          <div class="kicker corrupt-text">${esc(t.overrideKicker)}</div>
          <h2 class="title">${htmlText(t.overrideTitle)}</h2>
          <p class="lead">${htmlText(t.overrideLead)}</p>
          <div class="actions">
            <button class="btn primary" id="gtEnd">${esc(t.acceptButton)}</button>
          </div>
        </section>`;

      document.getElementById("gtEnd").onclick = () => {
        finishGorilla("true", t.finalReply, t.footer);
      };
    };
  }

  function finishGorilla(route, extra, footer) {
    const eConfig = getEndingConfig("gorilla", route);
    const eText = getEndingText("gorilla", route);

    saveEnding(eConfig.id);
    setBg(eConfig.image, eConfig.position);

    stage.innerHTML = `
      <section class="card center ${route === "true" ? "system-corrupt" : ""}">
        <div class="ending-count">${esc(eText.label)}</div>
        <div class="result-name">${esc(TEXT.gorilla.name)}</div>
        <div class="result-route">${esc(eText.routeLabel)}</div>
        <h2 class="question" style="margin-top:14px">${htmlText(eText.title)}</h2>
        ${extra ? `<p class="lead">${htmlText(extra)}</p>` : ""}
        <p class="muted">${htmlText(footer)}</p>
        ${finalActions("gorilla")}
      </section>`;

    bindFinalActions("gorilla");
  }

  function finalActions(therapistId) {
    const name = TEXT[therapistId].name;

    return `
      <div class="actions">
        <button class="btn primary" id="profileBtn">${
          esc(template(TEXT.ui.profileButton, {therapist: name}))
        }</button>
        <button class="btn" id="againBtn">${esc(TEXT.ui.retryButton)}</button>
        <button class="btn" id="collectionEndBtn">${esc(TEXT.ui.collectionButton)}</button>
      </div>
      <div class="collection-summary">${esc(foundSummary())}</div>`;
  }

  function bindFinalActions(therapistId) {
    const profileUrl = CONFIG.therapists[therapistId].profileUrl;

    document.getElementById("profileBtn").onclick = () => {
      window.open(profileUrl, "_blank", "noopener");
    };

    document.getElementById("againBtn").onclick = startScreen;
    document.getElementById("collectionEndBtn").onclick = collectionScreen;
  }

  function collectionScreen() {
    homeBtn.hidden = false;
    gorillaMeter.hidden = true;
    brand.textContent = TEXT.ui.brand;
    setBg(null);

    const found = getFound();

    const rows = CONFIG.endingOrder.map(([therapistId, route], index) => {
      const config = getEndingConfig(therapistId, route);
      const text = getEndingText(therapistId, route);
      const isFound = found.includes(config.id);
      const isSecret = route === "true";

      return `
        <div class="end-item ${isFound ? "found" : ""} ${isSecret ? "secret-item" : ""}">
          <div class="label">
            ${String(index + 1).padStart(2, "0")}　
            ${isFound ? esc(text.label) : esc(TEXT.ui.hiddenEnding)}
          </div>
          <div class="state">${isFound ? esc(TEXT.ui.found) : esc(TEXT.ui.notFound)}</div>
        </div>`;
    }).join("");

    stage.innerHTML = `
      <section class="card">
        <div class="kicker">${esc(TEXT.ui.collectionKicker)}</div>
        <h2 class="question">${esc(TEXT.ui.collectionTitle)}</h2>
        <p class="muted">${
          esc(template(TEXT.ui.collectionHelp, {
            found: found.length,
            total: CONFIG.endingOrder.length
          }))
        }</p>
        <div class="collection-grid">${rows}</div>
        <div class="actions">
          <button class="btn primary" id="playFromCollection">${esc(TEXT.ui.collectionPlay)}</button>
          <button class="btn" id="backFromCollection">${esc(TEXT.ui.collectionBack)}</button>
        </div>
      </section>`;

    document.getElementById("playFromCollection").onclick = nameScreen;
    document.getElementById("backFromCollection").onclick = startScreen;
  }

  homeBtn.onclick = startScreen;
  collectionBtn.onclick = collectionScreen;

  startScreen();
})();
