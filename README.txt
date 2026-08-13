AMEHA NOVEL GAME V4 - 保守性改善版

【V4の最大の変更】
ゲームシステムと文章を完全分離しました。

■ 自由に編集してよいファイル
content/text.js

このファイルだけで以下を変更できます。
・質問文
・選択肢
・タイトル
・ボタン文
・なゆたのセリフ
・ゴリラのセリフ
・ナレーション
・ENDタイトル
・END説明

文章を変更しても、判定ポイントや分岐条件は変わりません。

--------------------------------------------------

■ 基本触らないファイル

config/game-config.js
→ 判定ポイント、分岐条件、画像、プロフィールURL、END ID

js/game.js
→ ゲームシステム本体

css/style.css
→ デザイン

index.html
→ 各ファイルの読み込み

--------------------------------------------------

【GitHubで文章だけ変更する手順】

1. GitHubリポジトリを開く
2. content フォルダを開く
3. text.js を開く
4. 鉛筆マーク（Edit this file）
5. 変更したい文章だけ修正
6. Commit changes

GitHub Pagesへ自動反映されます。

--------------------------------------------------

【GitHubへV4を更新する方法】

V4 ZIPを解凍して以下をアップロード・上書きします。

index.html
README.txt
EDIT_TEXT_ONLY.txt
content/
config/
js/
css/
assets/

V3には content/ と config/ が存在しないため、
この2フォルダは新規追加されます。

GitHub Pages URLとJimdo iframe URLは変更不要です。
