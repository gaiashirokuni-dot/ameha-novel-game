AMEHA NOVEL GAME V5

【V5の変更】
・個別ルートを「実写風背景＋背景透過立ち絵＋会話UI」に変更
・なゆた／ゴリラの生成済み立ち絵を実装
・生成済み実写風背景を実装
・ENDに入ると立ち絵を消し、従来の宣材写真をイベントCGとして表示
・文章とゲームシステムの分離は維持

【素材構造】
assets/
  backgrounds/
    city-day.webp
    cafe.webp
    city-night.webp
    hotel.webp
    gym.webp

  standing/
    nayuta/normal.png
    gorilla/normal.png

  nayuta/
    既存宣材写真（END用イベントCG）

  gorilla/
    既存宣材写真（END用イベントCG）

【文章変更】
content/text.js
だけ編集してください。

【背景・立ち絵変更】
config/scene-config.js

【判定変更】
config/game-config.js

【ゲームシステム】
js/game.js

【GitHub更新】
ZIPを解凍し、中身を既存リポジトリへ上書きしてください。
V5では assets/backgrounds、assets/standing、config/scene-config.js が追加されます。

GitHub Pages URL、Jimdo iframe URLは変更不要です。
