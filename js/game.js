(() => {
  const stage = document.getElementById("stage");
  const backdrop = document.getElementById("backdrop");
  const flash = document.getElementById("flash");
  const homeBtn = document.getElementById("homeBtn");
  const collectionBtn = document.getElementById("collectionBtn");

  const ENDING_ORDER = [
    ["nayuta","date"],["nayuta","love"],["nayuta","adult"],
    ["gorilla","date"],["gorilla","love"],["gorilla","adult"]
  ];

  const QUESTIONS = [
    {
      text:"せっかく予定のない休日。\n今の気分に近いのは？",
      choices:[
        {text:"行ったことのない場所へ出かけたい", scores:{route:{date:2},therapist:{gorilla:1}}},
        {text:"気になる人とのんびり過ごしたい", scores:{route:{love:2},therapist:{nayuta:1}}},
        {text:"今日は少し刺激的なことをしてみたい", scores:{route:{adult:2}}}
      ]
    },
    {
      text:"初対面の相手。\nどんな瞬間に惹かれそう？",
      choices:[
        {text:"声や話し方、空気感にドキッとした時", scores:{therapist:{nayuta:3},route:{love:1}}},
        {text:"立ち姿や頼もしさを感じた時", scores:{therapist:{gorilla:3},route:{adult:1}}},
        {text:"見た目と中身のギャップを見つけた時", scores:{therapist:{gorilla:2,nayuta:1}}}
      ]
    },
    {
      text:"デート中、少し沈黙が続いた。\nあなたなら？",
      choices:[
        {text:"その静かな時間も心地いい", scores:{therapist:{nayuta:2},route:{love:1}}},
        {text:"何か面白いことを始める", scores:{therapist:{gorilla:2},route:{date:2}}},
        {text:"相手がどう出るか、少し待ってみる", scores:{route:{adult:1,love:1}}}
      ]
    },
    {
      text:"突然「このあと何する？」と聞かれた。",
      choices:[
        {text:"カラオケに行く", scores:{therapist:{nayuta:2},route:{date:2}}},
        {text:"身体を動かしたい", scores:{therapist:{gorilla:2,nayuta:1},route:{date:2}}},
        {text:"今日は相手に全部任せてみる", scores:{route:{adult:3},therapist:{gorilla:1}}}
      ]
    },
    {
      text:"恋人っぽい距離感なら、どれがいい？",
      choices:[
        {text:"自然に手をつないで歩く", scores:{therapist:{nayuta:2},route:{love:3}}},
        {text:"ぎゅっと抱きしめられる", scores:{route:{love:2,adult:1}}},
        {text:"なぜか腕相撲を挑まれる", scores:{therapist:{gorilla:4},route:{love:1,date:1}}}
      ]
    },
    {
      text:"相手に言われて、一番ドキッとするのは？",
      choices:[
        {text:"「……こっちおいで」", scores:{therapist:{nayuta:3},route:{love:2}}},
        {text:"「ハニー、店長に任せて」", scores:{therapist:{gorilla:4},route:{adult:2}}},
        {text:"言葉より行動で示してほしい", scores:{route:{adult:2},therapist:{gorilla:1}}}
      ]
    },
    {
      text:"今日くらいは――",
      choices:[
        {text:"いっぱい笑いたい", scores:{route:{date:3}}},
        {text:"思いっきり甘えたい", scores:{route:{love:3},therapist:{nayuta:1}}},
        {text:"ちょっとだけ、悪い子になりたい", scores:{route:{adult:4}}}
      ]
    },
    {
      text:"目の前に、二つの扉がある。\nさて、どっちへ行く？",
      sub:"一方からは静かな低い声。\nもう一方からは……なぜかダンベルが転がってきた。",
      choices:[
        {text:"静かな声のする方へ", scores:{therapist:{nayuta:4}}, tie:{therapist:"nayuta"}},
        {text:"ダンベルを拾ってみる", scores:{therapist:{gorilla:4}}, tie:{therapist:"gorilla"}},
        {text:"目を閉じて、直感で扉を開ける", scores:{route:{date:1,love:1,adult:1}}}
      ]
    }
  ];

  let state = freshState();

  function freshState(){
    return {
      name:"あなた",
      index:0,
      score:{
        therapist:{nayuta:0,gorilla:0},
        route:{date:0,love:0,adult:0}
      },
      tie:{therapist:"nayuta",route:"love"},
      result:null
    };
  }

  function esc(s){
    return String(s ?? "").replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  function setBg(url, pos="center"){
    if(!url){
      backdrop.style.backgroundImage = "";
      backdrop.style.backgroundPosition = "center";
      return;
    }
    backdrop.style.backgroundImage = `url("${url}")`;
    backdrop.style.backgroundPosition = pos;
  }

  function getFound(){
    try{
      return JSON.parse(localStorage.getItem("amehaNovelEndsV2") || "[]");
    }catch{
      return [];
    }
  }

  function saveEnding(id){
    const list = getFound();
    if(!list.includes(id)){
      list.push(id);
      localStorage.setItem("amehaNovelEndsV2", JSON.stringify(list));
    }
  }

  function foundSummary(){
    return `発見済み END：${getFound().length} / ${ENDING_ORDER.length}`;
  }

  function routeDisplay(route){
    return route === "date" ? "DATE" : route === "love" ? "LOVE" : "ADULT";
  }

  function startScreen(){
    state = freshState();
    homeBtn.hidden = true;
    setBg(null);
    stage.innerHTML = `
      <section class="card center">
        <div class="kicker">MULTI ENDING NOVEL / 8 QUESTIONS</div>
        <h1 class="title">あなたが今日、<br>出会うのは――？</h1>
        <p class="lead">8つの選択の先で、<br>出会う相手と、その人との過ごし方が変わります。</p>
        <div class="collection-summary">${foundSummary()}</div>
        <div class="actions">
          <button class="btn primary" id="startBtn">START</button>
          <button class="btn" id="collectionStartBtn">エンディング一覧を見る</button>
        </div>
      </section>`;
    document.getElementById("startBtn").onclick = nameScreen;
    document.getElementById("collectionStartBtn").onclick = collectionScreen;
  }

  function nameScreen(){
    homeBtn.hidden = false;
    stage.innerHTML = `
      <section class="card">
        <div class="kicker">BEFORE START</div>
        <h2 class="question">なんて呼ばれたい？</h2>
        <p class="muted">ゲーム中の呼び名に使います。入力内容は保存しません。</p>
        <input id="nameInput" class="name-input" maxlength="12" placeholder="例：さくら">
        <div class="actions">
          <button class="btn primary" id="nameGo">この名前で始める</button>
          <button class="btn" id="skipName">名前を入れずに始める</button>
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
    input.addEventListener("keydown", e => { if(e.key === "Enter") go(); });
    input.focus();
  }

  function progressHtml(){
    return `<div class="progress">${QUESTIONS.map((_,i)=>`<i class="${i<=state.index?"on":""}"></i>`).join("")}</div>`;
  }

  function questionScreen(){
    setBg(null);
    const q = QUESTIONS[state.index];
    stage.innerHTML = `
      <section class="card">
        ${progressHtml()}
        <div class="kicker">QUESTION ${state.index+1} / ${QUESTIONS.length}</div>
        <h2 class="question">${esc(q.text).replace(/\n/g,"<br>")}</h2>
        ${q.sub ? `<p class="muted">${esc(q.sub).replace(/\n/g,"<br>")}</p>` : ""}
        <div class="actions" id="choices"></div>
      </section>`;

    const wrap = document.getElementById("choices");
    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.textContent = choice.text;
      btn.onclick = () => choose(choice);
      wrap.appendChild(btn);
    });
  }

  function addScores(target, scores){
    if(!scores) return;
    Object.entries(scores).forEach(([k,v]) => target[k] = (target[k] || 0) + v);
  }

  function choose(choice){
    addScores(state.score.therapist, choice.scores?.therapist);
    addScores(state.score.route, choice.scores?.route);
    if(choice.tie?.therapist) state.tie.therapist = choice.tie.therapist;
    if(choice.tie?.route) state.tie.route = choice.tie.route;

    state.index++;
    if(state.index < QUESTIONS.length) questionScreen();
    else preReveal();
  }

  function maxKey(obj, fallback){
    const entries = Object.entries(obj);
    const max = Math.max(...entries.map(([,v])=>v));
    const winners = entries.filter(([,v])=>v===max).map(([k])=>k);
    return winners.length === 1 ? winners[0] : (winners.includes(fallback) ? fallback : winners[0]);
  }

  function resolveResult(){
    const therapist = maxKey(state.score.therapist, state.tie.therapist);
    const route = maxKey(state.score.route, state.tie.route);
    return {therapist, route};
  }

  function preReveal(){
    state.result = resolveResult();
    setBg(null);
    stage.innerHTML = `
      <section class="card center">
        <div class="kicker">RESULT</div>
        <div class="reveal-dots">…</div>
        <h2 class="title">今日、${esc(state.name)}が<br>選んだ物語は――</h2>
        <p class="lead">その扉の先にいる人へ。</p>
        <div class="actions">
          <button class="btn primary" id="revealBtn">扉を開ける</button>
        </div>
      </section>`;
    document.getElementById("revealBtn").onclick = dramaticReveal;
  }

  function dramaticReveal(){
    flash.classList.add("on");
    setTimeout(() => {
      revealEnding();
      setTimeout(() => flash.classList.remove("on"), 150);
    }, 580);
  }

  function endingObject(){
    const t = THERAPISTS[state.result.therapist];
    const e = t.endings[state.result.route];
    return {t,e};
  }

  function personalize(text){
    const called = state.name === "あなた" ? "ハニー" : state.name;
    return text.replaceAll("○○", called);
  }

  function revealEnding(){
    const {t,e} = endingObject();
    saveEnding(e.id);
    setBg(e.image, e.position);

    stage.innerHTML = `
      <section class="card center">
        <div class="ending-count">${e.label}</div>
        <div class="result-name">${t.name}</div>
        <div class="result-route">${e.routeLabel}</div>
        <p class="lead">${esc(personalize(e.line)).replace(/\n/g,"<br>")}</p>
        <p class="muted">${esc(e.body).replace(/\n/g,"<br>")}</p>
        <div class="actions">
          <button class="btn primary" id="profileBtn">${t.name}のプロフィールを見る</button>
          <button class="btn" id="againBtn">別のENDを探す</button>
          <button class="btn" id="collectionEndBtn">ENDコレクションを見る</button>
        </div>
        <div class="collection-summary">${foundSummary()}</div>
      </section>`;

    document.getElementById("profileBtn").onclick = () => window.open(t.profileUrl,"_blank","noopener");
    document.getElementById("againBtn").onclick = startScreen;
    document.getElementById("collectionEndBtn").onclick = collectionScreen;
  }

  function collectionScreen(){
    homeBtn.hidden = false;
    setBg(null);
    const found = getFound();

    const rows = ENDING_ORDER.map(([tid,route], idx) => {
      const t = THERAPISTS[tid];
      const e = t.endings[route];
      const isFound = found.includes(e.id);
      return `
        <div class="end-item ${isFound ? "found" : ""}">
          <div class="label">${String(idx+1).padStart(2,"0")}　${isFound ? esc(e.label) : "？？？"}</div>
          <div class="state">${isFound ? "FOUND" : "未発見"}</div>
        </div>`;
    }).join("");

    stage.innerHTML = `
      <section class="card">
        <div class="kicker">ENDING COLLECTION</div>
        <h2 class="question">END COLLECTION</h2>
        <p class="muted">${foundSummary()}。まだ見ていないENDは「？？？」で表示されます。</p>
        <div class="collection-grid">${rows}</div>
        <div class="actions">
          <button class="btn primary" id="playFromCollection">ゲームを始める</button>
          <button class="btn" id="backFromCollection">タイトルへ戻る</button>
        </div>
      </section>`;

    document.getElementById("playFromCollection").onclick = nameScreen;
    document.getElementById("backFromCollection").onclick = startScreen;
  }

  homeBtn.onclick = startScreen;
  collectionBtn.onclick = collectionScreen;
  startScreen();
})();
