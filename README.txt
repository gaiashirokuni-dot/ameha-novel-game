AMEHA NOVEL GAME V2 - GitHub Pages用

【V2で追加した機能】
・質問数：4問 → 8問
・エンディング：2種類 → 6種類
・判定軸を2系統に分離
  1. セラピスト判定：なゆた / ゴリラ
  2. 過ごし方判定：DATE / LOVE / ADULT
・6種類の専用エンディング
・END COLLECTION
・未発見ENDは「？？？」表示
・発見済みENDをブラウザのlocalStorageへ保存
・結果表示前の暗転演出
・各ENDからプロフィールへ遷移
・再プレイ対応

【6 ENDINGS】
01 NAYUTA DATE END
02 NAYUTA LOVE END
03 NAYUTA NIGHT END
04 GORILLA DATE END
05 GORILLA LOVE END
06 GORILLA DARK END

【GitHubへ更新する場合】
既存リポジトリのファイルを、このV2の中身で上書きしてください。

ルート直下：
index.html

フォルダ：
css/
js/
assets/

GitHub Pagesが main / (root) を参照していれば、
Jimdo側のiframe URLを変更する必要はありません。

【将来5人へ増やす場合】
主に以下を追加・変更します。
・js/therapists.js：セラピスト情報とEND定義
・assets/：各セラピストの素材
・js/game.js：質問の加点先とENDING_ORDER

ゲームUI本体は共通利用できます。
