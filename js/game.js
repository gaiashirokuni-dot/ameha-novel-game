(() => {
  const stage = document.getElementById("stage");
  const backdrop = document.getElementById("backdrop");
  const flash = document.getElementById("flash");
  const systemAlert = document.getElementById("systemAlert");
  const homeBtn = document.getElementById("homeBtn");
  const collectionBtn = document.getElementById("collectionBtn");
  const gorillaMeter = document.getElementById("gorillaMeter");
  const brand = document.getElementById("brand");

  const ENDING_ORDER = [
    ["nayuta","date"],["nayuta","love"],["nayuta","adult"],
    ["gorilla","date"],["gorilla","love"],["gorilla","adult"],
    ["gorilla","true"]
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
        {text:"立ち姿や頼もしさを感じた時", scores:{therapist:{gorilla:3},route:{adult:1}}, gorillaSecret:1},
        {text:"見た目と中身のギャップを見つけた時", scores:{therapist:{gorilla:2,nayuta:1}}, gorillaSecret:1}
      ]
    },
    {
      text:"デート中、少し沈黙が続いた。\nあなたなら？",
      choices:[
        {text:"その静かな時間も心地いい", scores:{therapist:{nayuta:2},route:{love:1}}},
        {text:"何か面白いことを始める", scores:{therapist:{gorilla:2},route:{date:2}}, gorillaSecret:1},
        {text:"相手がどう出るか、少し待ってみる", scores:{route:{adult:1,love:1}}}
      ]
    },
    {
      text:"突然「このあと何する？」と聞かれた。",
      choices:[
        {text:"カラオケに行く", scores:{therapist:{nayuta:2},route:{date:2}}},
        {text:"身体を動かしたい", scores:{therapist:{gorilla:2,nayuta:1},route:{date:2}}, gorillaSecret:2},
        {text:"今日は相手に全部任せてみる", scores:{route:{adult:3},therapist:{gorilla:1}}, gorillaSecret:1}
      ]
    },
    {
      text:"恋人っぽい距離感なら、どれがいい？",
      choices:[
        {text:"自然に手をつないで歩く", scores:{therapist:{nayuta:2},route:{love:3}}},
        {text:"ぎゅっと抱きしめられる", scores:{route:{love:2,adult:1}}},
        {text:"なぜか腕相撲を挑まれる", scores:{therapist:{gorilla:4},route:{love:1,date:1}}, gorillaSecret:3}
      ]
    },
    {
      text:"相手に言われて、一番ドキッとするのは？",
      choices:[
        {text:"「……こっちおいで」", scores:{therapist:{nayuta:3},route:{love:2}}},
        {text:"「ハニー、店長に任せて」", scores:{therapist:{gorilla:4},route:{adult:2}}, gorillaSecret:3},
        {text:"言葉より行動で示してほしい", scores:{route:{adult:2},therapist:{gorilla:1}}, gorillaSecret:1}
      ]
    },
    {
      text:"今日くらいは――",
      choices:[
        {text:"いっぱい笑いたい", scores:{route:{date:3}}},
        {text:"思いっきり甘えたい", scores:{route:{love:3},therapist:{nayuta:1}}},
        {text:"ちょっとだけ、悪い子になりたい", scores:{route:{adult:4}}, gorillaSecret:1}
      ]
    },
    {
      text:"目の前に、二つの扉がある。\nさて、どっちへ行く？",
      sub:"一方からは静かな低い声。\nもう一方からは……なぜかダンベルが転がってきた。",
      choices:[
        {text:"静かな声のする方へ", scores:{therapist:{nayuta:4}}, tie:{therapist:"nayuta"}},
        {text:"ダンベルを拾ってみる", scores:{therapist:{gorilla:4}}, tie:{therapist:"gorilla"}, gorillaSecret:4},
        {text:"目を閉じて、直感で扉を開ける", scores:{route:{date:1,love:1,adult:1}}}
      ]
    }
  ];

  let state = freshState();

  function freshState(){
    return {
      name:"あなた",
      index:0,
      score:{ therapist:{nayuta:0,gorilla:0}, route:{date:0,love:0,adult:0} },
      tie:{therapist:"nayuta",route:"love"},
      gorillaSecret:0,
      result:null
    };
  }

  function esc(s){
    return String(s ?? "").replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  function calledName(){
    return state.name === "あなた" ? "ハニー" : state.name;
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
    try{ return JSON.parse(localStorage.getItem("amehaNovelEndsV3") || "[]"); }
    catch{ return []; }
  }

  function saveEnding(id){
    const list = getFound();
    if(!list.includes(id)){
      list.push(id);
      localStorage.setItem("amehaNovelEndsV3", JSON.stringify(list));
    }
  }

  function foundSummary(){
    return `発見済み END：${getFound().length} / ${ENDING_ORDER.length}`;
  }

  function gorillaLevel(){
    const g = state.score.therapist.gorilla || 0;
    const n = state.score.therapist.nayuta || 0;
    const total = Math.max(1, g+n);
    return Math.min(100, Math.round((g/total)*100));
  }

  function updateCorruption(){
    const level = gorillaLevel();
    if(state.index >= 3 && level >= 55){
      gorillaMeter.hidden = false;
      gorillaMeter.textContent = `GORILLA LEVEL ${level}%`;
      brand.textContent = level >= 75 ? "SYSTEM // GORILLA" : "THERAPIST STORY";
    }else{
      gorillaMeter.hidden = true;
      brand.textContent = "THERAPIST STORY";
    }
  }

  function showAlert(msg, duration=1400){
    systemAlert.innerHTML = msg;
    systemAlert.classList.add("on");
    setTimeout(()=>systemAlert.classList.remove("on"), duration);
  }

  function startScreen(){
    state = freshState();
    homeBtn.hidden = true;
    gorillaMeter.hidden = true;
    brand.textContent = "THERAPIST STORY";
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
    const go = () => { state.name = input.value.trim() || "あなた"; questionScreen(); };
    document.getElementById("nameGo").onclick = go;
    document.getElementById("skipName").onclick = () => { state.name = "あなた"; questionScreen(); };
    input.addEventListener("keydown", e => { if(e.key === "Enter") go(); });
    input.focus();
  }

  function progressHtml(){
    return `<div class="progress">${QUESTIONS.map((_,i)=>`<i class="${i<=state.index?"on":""}"></i>`).join("")}</div>`;
  }

  function questionScreen(){
    setBg(null);
    updateCorruption();
    const q = QUESTIONS[state.index];
    const corrupt = gorillaLevel() >= 75 && state.index >= 4;
    stage.innerHTML = `
      <section class="card ${corrupt ? "system-corrupt" : ""}">
        ${progressHtml()}
        <div class="kicker">${corrupt ? "GORILLA DIAGNOSTIC" : `QUESTION ${state.index+1} / ${QUESTIONS.length}`}</div>
        <h2 class="question">${esc(q.text).replace(/\n/g,"<br>")}</h2>
        ${q.sub ? `<p class="muted">${esc(q.sub).replace(/\n/g,"<br>")}</p>` : ""}
        <div class="actions" id="choices"></div>
      </section>`;

    const wrap = document.getElementById("choices");
    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice" + (choice.gorillaSecret ? " gorilla-choice" : "");
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
    state.gorillaSecret += choice.gorillaSecret || 0;

    if(choice.tie?.therapist) state.tie.therapist = choice.tie.therapist;
    if(choice.tie?.route) state.tie.route = choice.tie.route;

    const level = gorillaLevel();
    if(state.index >= 4 && level >= 82 && state.gorillaSecret >= 6){
      showAlert(`警告<br>ゴリラ濃度が規定値を超えました。`);
    }

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
    const secret = therapist === "gorilla" && state.gorillaSecret >= 10 && state.score.therapist.gorilla >= 12;
    return secret ? {therapist:"gorilla",route:"true"} : {therapist,route};
  }

  function preReveal(){
    state.result = resolveResult();

    if(state.result.route === "true"){
      brand.textContent = "SYSTEM // OVERRIDDEN";
      gorillaMeter.hidden = false;
      gorillaMeter.textContent = "GORILLA LEVEL 100%";
      stage.innerHTML = `
        <section class="card center system-corrupt">
          <div class="kicker corrupt-text">SYSTEM WARNING</div>
          <h2 class="title">判定処理に<br>異常が発生しました。</h2>
          <p class="lead">原因：ゴリラを選びすぎています。</p>
          <div class="actions">
            <button class="btn primary" id="continueSecret">続行する</button>
          </div>
        </section>`;
      document.getElementById("continueSecret").onclick = () => {
        showAlert("ルート補正を無視します。", 900);
        setTimeout(normalPreReveal, 700);
      };
      return;
    }
    normalPreReveal();
  }

  function normalPreReveal(){
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
      if(state.result.therapist === "gorilla") startGorillaEnding();
      else revealStandardEnding();
      setTimeout(() => flash.classList.remove("on"), 150);
    }, 580);
  }

  function endingObject(){
    const t = THERAPISTS[state.result.therapist];
    const e = t.endings[state.result.route];
    return {t,e};
  }

  function personalize(text){
    return text.replaceAll("○○", calledName());
  }

  function revealStandardEnding(){
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
        ${finalActions(t)}
      </section>`;
    bindFinalActions(t);
  }

  function startGorillaEnding(){
    const {e} = endingObject();
    setBg(e.image, e.position);

    if(state.result.route === "date") gorillaDate1();
    else if(state.result.route === "love") gorillaLove1();
    else if(state.result.route === "adult") gorillaDark1();
    else gorillaTrue1();
  }

  function gorillaDate1(){
    stage.innerHTML = `
      <section class="card">
        <div class="speaker">ゴリラ</div>
        <div class="dialogue">「ハニー。今日は店長が最高のデートプランを考えてきたよ。」</div>
        <div class="actions">
          <button class="choice" id="gd1">ちょっと安心する</button>
        </div>
      </section>`;
    document.getElementById("gd1").onclick = gorillaDate2;
  }

  function gorillaDate2(){
    stage.innerHTML = `
      <section class="card">
        <div class="speaker">ゴリラ</div>
        <div class="dialogue">「まずジムでBIG3測ります。」<br><br>「そのあとポケカショップ。」<br><br>「最後は公園を散歩しよう。」</div>
        <div class="actions"><button class="choice" id="gd2">……意外と普通？</button></div>
      </section>`;
    document.getElementById("gd2").onclick = gorillaDate3;
  }

  function gorillaDate3(){
    stage.innerHTML = `
      <section class="card">
        <div class="speaker">ゴリラ</div>
        <div class="dialogue">「あ、散歩で使う首輪。」<br><br>「赤と黒、どっちがいい？」</div>
        <div class="actions">
          <button class="choice" data-answer="wait">待って</button>
          <button class="choice" data-answer="why">なぜ首輪があるの？</button>
          <button class="choice gorilla-choice" data-answer="black">黒</button>
        </div>
      </section>`;
    stage.querySelectorAll("[data-answer]").forEach(b => b.onclick = () => {
      const a = b.dataset.answer;
      const extra = a === "black" ? "「さすがハニー。店長も黒だと思ってた。」" :
                    a === "why" ? "「散歩だから。」" : "「うん。店長も今ちょっと待った方がいいと思った。」";
      finishGorilla("date", extra, "今日あなたが学んだこと。\\n「デート」という言葉の定義は、人によってかなり違う。");
    });
  }

  function gorillaLove1(){
    stage.innerHTML = `
      <section class="card">
        <div class="speaker">ゴリラ</div>
        <div class="dialogue">「ハニー。店長さ、今日はちゃんと恋人っぽいことしたいんだ。」</div>
        <div class="actions">
          <button class="choice" data-love="hand">手をつなぐ？</button>
          <button class="choice" data-love="hug">ハグ？</button>
          <button class="choice" data-love="kiss">キス？</button>
        </div>
      </section>`;
    stage.querySelectorAll("[data-love]").forEach(b => b.onclick = gorillaLove2);
  }

  function gorillaLove2(){
    stage.innerHTML = `
      <section class="card center">
        <div class="kicker">恋人っぽいこと</div>
        <h2 class="title">腕相撲。</h2>
        <div class="actions">
          <button class="choice" data-arm="fight">本気で勝ちにいく</button>
          <button class="choice" data-arm="lose">わざと負ける</button>
          <button class="choice" data-arm="no">そもそもやらない</button>
        </div>
      </section>`;
    stage.querySelectorAll("[data-arm]").forEach(b => b.onclick = () => {
      const a = b.dataset.arm;
      let msg = "";
      if(a === "fight") msg = "「いいねハニー。そういう女、店長好きだよ。」";
      if(a === "lose") msg = "「……今、手抜いたでしょ？」";
      if(a === "no") msg = "「そっか。じゃあ普通に手つなご。」";
      gorillaLove3(msg);
    });
  }

  function gorillaLove3(msg){
    stage.innerHTML = `
      <section class="card">
        <div class="speaker">ゴリラ</div>
        <div class="dialogue">${esc(msg)}<br><br>店長があなたの手を握る。<br><br>「ハニー。店長、こう見えて手つなぐ時は普通なんだよ。」<br><br>……3秒後。<br><br>「このあとプロテイン飲みに行く？」</div>
        <div class="actions"><button class="btn primary" id="glEnd">ENDへ</button></div>
      </section>`;
    document.getElementById("glEnd").onclick = () => finishGorilla("love", "", "恋とは、腕相撲のあとに始まる。");
  }

  function gorillaDark1(){
    stage.innerHTML = `
      <section class="card">
        <div class="speaker">ゴリラ</div>
        <div class="dialogue">「ハニー。ここから先は、ちゃんと確認しながらいくから安心して。」<br><br>「嫌なことは嫌って言ってね。」</div>
        <div class="actions">
          <button class="choice" data-dark="ok">うん</button>
          <button class="choice" data-dark="nervous">ちょっと緊張する</button>
          <button class="choice gorilla-choice" data-dark="leave">店長に任せる</button>
        </div>
      </section>`;
    stage.querySelectorAll("[data-dark]").forEach(b => b.onclick = gorillaDark2);
  }

  function gorillaDark2(){
    flash.classList.add("on");
    setTimeout(()=>{
      flash.classList.remove("on");
      stage.innerHTML = `
        <section class="card">
          <div class="kicker corrupt-text">ITEM GET</div>
          <div class="item-card">
            <div class="item-title">LEGENDARY EQUIPMENT</div>
            <div class="item-name">首輪</div>
            <div class="item-stats">
              レア度：★★★★★<br>
              防御力：0<br>
              店長への信頼度：+50<br>
              使用条件：双方の同意
            </div>
          </div>
          <div class="actions">
            <button class="choice" data-item="equip">装備する</button>
            <button class="choice" data-item="info">アイテム説明をもう一度読む</button>
            <button class="choice" data-item="drop">捨てる</button>
          </div>
        </section>`;
      stage.querySelectorAll("[data-item]").forEach(b => b.onclick = () => {
        const a = b.dataset.item;
        if(a === "info"){ gorillaDark2(); return; }
        const msg = a === "equip" ? "「ハニー。似合う。」\\n\\n「……店長より強そう。」" :
                    "「うん。要らない時は使わなくていい。」";
        finishGorilla("adult", msg, "あなたは禁断の装備を手に入れた。");
      });
    },550);
  }

  function gorillaTrue1(){
    brand.textContent = "GORILLA SYSTEM";
    gorillaMeter.hidden = false;
    gorillaMeter.textContent = "GORILLA LEVEL 100%";
    stage.innerHTML = `
      <section class="card center system-corrupt">
        <div class="kicker corrupt-text">SECRET ROUTE</div>
        <h2 class="title">GORILLA TRUE END</h2>
        <p class="lead">「……ハニー。」<br><br>「店長を選びすぎ。」</p>
        <div class="actions">
          <button class="btn primary" id="gt1">続ける</button>
        </div>
      </section>`;
    document.getElementById("gt1").onclick = () => {
      stage.innerHTML = `
        <section class="card center system-corrupt">
          <div class="kicker corrupt-text">SYSTEM OVERRIDDEN</div>
          <h2 class="title">もう店長から<br>逃げられない</h2>
          <p class="lead">診断結果ではありません。<br>あなた自身がここまで来ました。</p>
          <div class="actions">
            <button class="btn primary" id="gtEnd">受け入れる</button>
          </div>
        </section>`;
      document.getElementById("gtEnd").onclick = () => finishGorilla("true", "「ハニー。覚悟はいい？」", "GORILLA LEVEL：MAX");
    };
  }

  function finishGorilla(route, extra, footer){
    const t = THERAPISTS.gorilla;
    const e = t.endings[route];
    saveEnding(e.id);
    setBg(e.image, e.position);
    stage.innerHTML = `
      <section class="card center ${route==="true" ? "system-corrupt" : ""}">
        <div class="ending-count">${e.label}</div>
        <div class="result-name">ゴリラ</div>
        <div class="result-route">${e.routeLabel}</div>
        <h2 class="question" style="margin-top:14px">${esc(e.title)}</h2>
        ${extra ? `<p class="lead">${esc(extra).replace(/\n/g,"<br>")}</p>` : ""}
        <p class="muted">${esc(footer).replace(/\n/g,"<br>")}</p>
        ${finalActions(t)}
      </section>`;
    bindFinalActions(t);
  }

  function finalActions(t){
    return `
      <div class="actions">
        <button class="btn primary" id="profileBtn">${t.name}のプロフィールを見る</button>
        <button class="btn" id="againBtn">別のENDを探す</button>
        <button class="btn" id="collectionEndBtn">ENDコレクションを見る</button>
      </div>
      <div class="collection-summary">${foundSummary()}</div>`;
  }

  function bindFinalActions(t){
    document.getElementById("profileBtn").onclick = () => window.open(t.profileUrl,"_blank","noopener");
    document.getElementById("againBtn").onclick = startScreen;
    document.getElementById("collectionEndBtn").onclick = collectionScreen;
  }

  function collectionScreen(){
    homeBtn.hidden = false;
    gorillaMeter.hidden = true;
    brand.textContent = "THERAPIST STORY";
    setBg(null);
    const found = getFound();

    const rows = ENDING_ORDER.map(([tid,route], idx) => {
      const t = THERAPISTS[tid];
      const e = t.endings[route];
      const isFound = found.includes(e.id);
      const secret = route === "true";
      return `
        <div class="end-item ${isFound ? "found" : ""} ${secret ? "secret-item" : ""}">
          <div class="label">${String(idx+1).padStart(2,"0")}　${isFound ? esc(e.label) : "？？？"}</div>
          <div class="state">${isFound ? "FOUND" : "未発見"}</div>
        </div>`;
    }).join("");

    stage.innerHTML = `
      <section class="card">
        <div class="kicker">ENDING COLLECTION</div>
        <h2 class="question">END COLLECTION</h2>
        <p class="muted">${foundSummary()}。7つ目は特定条件でのみ出現します。</p>
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
