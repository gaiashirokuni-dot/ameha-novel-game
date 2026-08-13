window.THERAPISTS = {
  nayuta: {
    id: "nayuta",
    name: "なゆた",
    profileUrl: "https://www.ame-ha-shizukani.com/%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88%E4%B8%80%E8%A6%A7/%E3%81%AA%E3%82%86%E3%81%9F/",
    traits: ["静かな色気", "魅惑のボイス", "ゆっくり距離を縮める"],
    images: [
      "assets/nayuta/nayuta-01.webp","assets/nayuta/nayuta-02.webp","assets/nayuta/nayuta-03.webp",
      "assets/nayuta/nayuta-04.webp","assets/nayuta/nayuta-05.webp","assets/nayuta/nayuta-06.webp",
      "assets/nayuta/nayuta-07.webp","assets/nayuta/nayuta-08.webp","assets/nayuta/nayuta-09.webp",
      "assets/nayuta/nayuta-10.webp","assets/nayuta/nayuta-11.webp","assets/nayuta/nayuta-12.webp"
    ],
    endings: {
      date: {
        id: "nayuta_date", label: "NAYUTA DATE END", routeLabel: "DATE END",
        image: "assets/nayuta/nayuta-01.webp", position: "center 33%",
        line: "「じゃあ今日は遊ぼっか。\\n○○ちゃんがやってみたいこと、一緒にしよ。」",
        body: "カラオケ、社交ダンス、写真撮影。\\n決まった形に縛られず、“一緒にやってみたい”を楽しむ時間。"
      },
      love: {
        id: "nayuta_love", label: "NAYUTA LOVE END", routeLabel: "LOVE END",
        image: "assets/nayuta/nayuta-07.webp", position: "center 28%",
        line: "「○○ちゃん。\\n……もうちょっと、こっち来る？」",
        body: "手をつないで、ハグをして、少しずつ近づく。\\n急がず、恋人みたいな距離感を楽しむ時間。"
      },
      adult: {
        id: "nayuta_night", label: "NAYUTA NIGHT END", routeLabel: "NIGHT END",
        image: "assets/nayuta/nayuta-12.webp", position: "center 27%",
        line: "「……一緒にシャワー、行こっか。」",
        body: "低い声と静かな空気の中で、少しだけ日常の外へ。\\nこの先は、実際に会った時のお楽しみ。"
      }
    }
  },

  gorilla: {
    id: "gorilla",
    name: "ゴリラ",
    profileUrl: "https://hitotokinorakuen.jimdofree.com/%E3%82%BB%E3%83%A9%E3%83%94%E3%82%B9%E3%83%88/%E9%AD%94%E7%8B%82-%E6%B3%A1/",
    traits: ["筋骨隆々", "見た目に反して温和", "時々ひょうきん"],
    images: [
      "assets/gorilla/gorilla-01.webp","assets/gorilla/gorilla-02.webp","assets/gorilla/gorilla-03.webp",
      "assets/gorilla/gorilla-04.webp","assets/gorilla/gorilla-05.webp","assets/gorilla/gorilla-06.webp",
      "assets/gorilla/gorilla-07.webp","assets/gorilla/gorilla-08.webp","assets/gorilla/gorilla-09.webp",
      "assets/gorilla/gorilla-10.webp","assets/gorilla/gorilla-11.webp","assets/gorilla/gorilla-12.webp",
      "assets/gorilla/gorilla-13.webp","assets/gorilla/gorilla-14.webp","assets/gorilla/gorilla-15.webp",
      "assets/gorilla/gorilla-16.webp","assets/gorilla/gorilla-17.webp"
    ],
    endings: {
      date: {
        id: "gorilla_date", label: "GORILLA DATE END", routeLabel: "DATE END",
        image: "assets/gorilla/gorilla-09.webp", position: "center 24%",
        title: "普通のデートを選んだはずだった",
        line: "「ハニー。今日は店長が最高のデートプランを考えてきたよ。」"
      },
      love: {
        id: "gorilla_love", label: "GORILLA LOVE END", routeLabel: "LOVE END",
        image: "assets/gorilla/gorilla-04.webp", position: "center 22%",
        title: "恋とは、腕相撲のあとに始まる",
        line: "「ハニー。店長さ、今日はちゃんと恋人っぽいことしたいんだ。」"
      },
      adult: {
        id: "gorilla_dark", label: "GORILLA DARK END", routeLabel: "DARK END",
        image: "assets/gorilla/gorilla-12.webp", position: "center 24%",
        title: "あなたは禁断の装備を手に入れた",
        line: "「ハニー。ここから先は、ちゃんと確認しながらいくから安心して。」"
      },
      true: {
        id: "gorilla_true", label: "GORILLA TRUE END", routeLabel: "SECRET END",
        image: "assets/gorilla/gorilla-11.webp", position: "center 22%",
        title: "もう店長から逃げられない",
        line: "「……ハニー。\\n店長を選びすぎ。」"
      }
    }
  }
};
