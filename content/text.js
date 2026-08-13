/*
============================================================
  AMEHA NOVEL GAME - 文章編集専用ファイル
============================================================

【このファイルは自由に編集OKです】

変更してよいもの：
・タイトル
・説明文
・質問文
・選択肢の文章
・なゆたのセリフ
・ゴリラのセリフ
・ナレーション
・ENDタイトル
・ボタン表示文

【重要】
・" や ` ではなく、基本的に "..." の中の文章だけ直してください。
・改行したい場合は \n を入れてください。
・キー名（例：q1_a / gorilla_date_opening）は変更しないでください。
・カンマ , や { } は削除しないでください。

判定ポイント・分岐条件・画像・システム処理は
別ファイルに分離されているため、この文章を変えても
エンディング判定には影響しません。
============================================================
*/

window.GAME_TEXT = {

  // -------------------------------------------------------
  // 共通UI
  // -------------------------------------------------------
  ui: {
    brand: "THERAPIST STORY",
    titleKicker: "MULTI ENDING NOVEL / 8 QUESTIONS",
    title: "あなたが今日、\n出会うのは――？",
    titleLead: "8つの選択の先で、\n出会う相手と、その人との過ごし方が変わります。",
    start: "START",
    viewCollection: "エンディング一覧を見る",

    nameKicker: "BEFORE START",
    nameQuestion: "なんて呼ばれたい？",
    nameHelp: "ゲーム中の呼び名に使います。入力内容は保存しません。",
    namePlaceholder: "例：さくら",
    nameSubmit: "この名前で始める",
    nameSkip: "名前を入れずに始める",

    resultKicker: "RESULT",
    resultTitle: "今日、{name}が\n選んだ物語は――",
    resultLead: "その扉の先にいる人へ。",
    revealButton: "扉を開ける",

    profileButton: "{therapist}のプロフィールを見る",
    retryButton: "別のENDを探す",
    collectionButton: "ENDコレクションを見る",

    collectionKicker: "ENDING COLLECTION",
    collectionTitle: "END COLLECTION",
    collectionHelp: "発見済み END：{found} / {total}。7つ目は特定条件でのみ出現します。",
    collectionPlay: "ゲームを始める",
    collectionBack: "タイトルへ戻る",
    found: "FOUND",
    notFound: "未発見",
    hiddenEnding: "？？？",

    systemWarning: "警告\nゴリラ濃度が規定値を超えました。",
    systemErrorKicker: "SYSTEM WARNING",
    systemErrorTitle: "判定処理に\n異常が発生しました。",
    systemErrorLead: "原因：ゴリラを選びすぎています。",
    systemContinue: "続行する",
    systemOverride: "ルート補正を無視します。"
  },

  // -------------------------------------------------------
  // 8つの質問
  // ※ ID（q1など）は変更しないでください
  // -------------------------------------------------------
  questions: {
    q1: {
      text: "せっかく予定のない休日。\n今の気分に近いのは？",
      choices: {
        a: "行ったことのない場所へ出かけたい",
        b: "気になる人とのんびり過ごしたい",
        c: "今日は少し刺激的なことをしてみたい"
      }
    },

    q2: {
      text: "初対面の相手。\nどんな瞬間に惹かれそう？",
      choices: {
        a: "声や話し方、空気感にドキッとした時",
        b: "立ち姿や頼もしさを感じた時",
        c: "見た目と中身のギャップを見つけた時"
      }
    },

    q3: {
      text: "デート中、少し沈黙が続いた。\nあなたなら？",
      choices: {
        a: "その静かな時間も心地いい",
        b: "何か面白いことを始める",
        c: "相手がどう出るか、少し待ってみる"
      }
    },

    q4: {
      text: "突然「このあと何する？」と聞かれた。",
      choices: {
        a: "カラオケに行く",
        b: "身体を動かしたい",
        c: "今日は相手に全部任せてみる"
      }
    },

    q5: {
      text: "恋人っぽい距離感なら、どれがいい？",
      choices: {
        a: "自然に手をつないで歩く",
        b: "ぎゅっと抱きしめられる",
        c: "なぜか腕相撲を挑まれる"
      }
    },

    q6: {
      text: "相手に言われて、一番ドキッとするのは？",
      choices: {
        a: "「……こっちおいで」",
        b: "「ハニー、店長に任せて」",
        c: "言葉より行動で示してほしい"
      }
    },

    q7: {
      text: "今日くらいは――",
      choices: {
        a: "いっぱい笑いたい",
        b: "思いっきり甘えたい",
        c: "ちょっとだけ、悪い子になりたい"
      }
    },

    q8: {
      text: "目の前に、二つの扉がある。\nさて、どっちへ行く？",
      sub: "一方からは静かな低い声。\nもう一方からは……なぜかダンベルが転がってきた。",
      choices: {
        a: "静かな声のする方へ",
        b: "ダンベルを拾ってみる",
        c: "目を閉じて、直感で扉を開ける"
      }
    }
  },

  // -------------------------------------------------------
  // なゆた END
  // -------------------------------------------------------
  nayuta: {
    name: "なゆた",

    date: {
      label: "NAYUTA DATE END",
      routeLabel: "DATE END",
      line: "「じゃあ今日は遊ぼっか。\n○○ちゃんがやってみたいこと、一緒にしよ。」",
      body: "カラオケ、社交ダンス、写真撮影。\n決まった形に縛られず、“一緒にやってみたい”を楽しむ時間。"
    },

    love: {
      label: "NAYUTA LOVE END",
      routeLabel: "LOVE END",
      line: "「○○ちゃん。\n……もうちょっと、こっち来る？」",
      body: "手をつないで、ハグをして、少しずつ近づく。\n急がず、恋人みたいな距離感を楽しむ時間。"
    },

    adult: {
      label: "NAYUTA NIGHT END",
      routeLabel: "NIGHT END",
      line: "「……一緒にシャワー、行こっか。」",
      body: "低い声と静かな空気の中で、少しだけ日常の外へ。\nこの先は、実際に会った時のお楽しみ。"
    }
  },

  // -------------------------------------------------------
  // ゴリラ END
  // -------------------------------------------------------
  gorilla: {
    name: "ゴリラ",

    date: {
      label: "GORILLA DATE END",
      routeLabel: "DATE END",
      title: "普通のデートを選んだはずだった",

      opening: "「ハニー。今日は店長が最高のデートプランを考えてきたよ。」",
      openingChoice: "ちょっと安心する",

      plan: "「まずジムでBIG3測ります。」\n\n「そのあとポケカショップ。」\n\n「最後は公園を散歩しよう。」",
      planChoice: "……意外と普通？",

      collar: "「あ、散歩で使う首輪。」\n\n「赤と黒、どっちがいい？」",
      collarChoices: {
        wait: "待って",
        why: "なぜ首輪があるの？",
        black: "黒"
      },

      collarReplies: {
        wait: "「うん。店長も今ちょっと待った方がいいと思った。」",
        why: "「散歩だから。」",
        black: "「さすがハニー。店長も黒だと思ってた。」"
      },

      footer: "今日あなたが学んだこと。\n「デート」という言葉の定義は、人によってかなり違う。"
    },

    love: {
      label: "GORILLA LOVE END",
      routeLabel: "LOVE END",
      title: "恋とは、腕相撲のあとに始まる",

      opening: "「ハニー。店長さ、今日はちゃんと恋人っぽいことしたいんだ。」",
      guesses: {
        hand: "手をつなぐ？",
        hug: "ハグ？",
        kiss: "キス？"
      },

      revealKicker: "恋人っぽいこと",
      reveal: "腕相撲。",

      armChoices: {
        fight: "本気で勝ちにいく",
        lose: "わざと負ける",
        no: "そもそもやらない"
      },

      armReplies: {
        fight: "「いいねハニー。そういう女、店長好きだよ。」",
        lose: "「……今、手抜いたでしょ？」",
        no: "「そっか。じゃあ普通に手つなご。」"
      },

      closing: "店長があなたの手を握る。\n\n「ハニー。店長、こう見えて手つなぐ時は普通なんだよ。」\n\n……3秒後。\n\n「このあとプロテイン飲みに行く？」",
      endButton: "ENDへ",
      footer: "恋とは、腕相撲のあとに始まる。"
    },

    adult: {
      label: "GORILLA DARK END",
      routeLabel: "DARK END",
      title: "あなたは禁断の装備を手に入れた",

      opening: "「ハニー。ここから先は、ちゃんと確認しながらいくから安心して。」\n\n「嫌なことは嫌って言ってね。」",
      choices: {
        ok: "うん",
        nervous: "ちょっと緊張する",
        leave: "店長に任せる"
      },

      itemKicker: "ITEM GET",
      itemCategory: "LEGENDARY EQUIPMENT",
      itemName: "首輪",
      itemStats: "レア度：★★★★★\n防御力：0\n店長への信頼度：+50\n使用条件：双方の同意",

      itemChoices: {
        equip: "装備する",
        info: "アイテム説明をもう一度読む",
        drop: "捨てる"
      },

      itemReplies: {
        equip: "「ハニー。似合う。」\n\n「……店長より強そう。」",
        drop: "「うん。要らない時は使わなくていい。」"
      },

      footer: "あなたは禁断の装備を手に入れた。"
    },

    true: {
      label: "GORILLA TRUE END",
      routeLabel: "SECRET END",
      title: "もう店長から逃げられない",

      kicker: "SECRET ROUTE",
      opening: "「……ハニー。」\n\n「店長を選びすぎ。」",
      continueButton: "続ける",

      overrideKicker: "SYSTEM OVERRIDDEN",
      overrideTitle: "もう店長から\n逃げられない",
      overrideLead: "診断結果ではありません。\nあなた自身がここまで来ました。",
      acceptButton: "受け入れる",

      finalReply: "「ハニー。覚悟はいい？」",
      footer: "GORILLA LEVEL：MAX"
    }
  }
};
