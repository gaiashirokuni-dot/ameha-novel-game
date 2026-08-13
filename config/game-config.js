/*
============================================================
  ゲーム設定・判定専用ファイル
============================================================

【基本的に編集しないでください】

ここには以下だけを置いています。
・質問のポイント
・セラピスト判定
・DATE / LOVE / ADULT判定
・ゴリラSECRET条件
・画像パス
・プロフィールURL
・END ID

文章は content/text.js に完全分離されています。
============================================================
*/

window.GAME_CONFIG = {

  storageKey: "amehaNovelEndsV4",

  endingOrder: [
    ["nayuta","date"],
    ["nayuta","love"],
    ["nayuta","adult"],
    ["gorilla","date"],
    ["gorilla","love"],
    ["gorilla","adult"],
    ["gorilla","true"]
  ],

  questions: [
    {
      id: "q1",
      choices: [
        {id:"a", scores:{route:{date:2},therapist:{gorilla:1}}},
        {id:"b", scores:{route:{love:2},therapist:{nayuta:1}}},
        {id:"c", scores:{route:{adult:2}}}
      ]
    },
    {
      id: "q2",
      choices: [
        {id:"a", scores:{therapist:{nayuta:3},route:{love:1}}},
        {id:"b", scores:{therapist:{gorilla:3},route:{adult:1}}, gorillaSecret:1},
        {id:"c", scores:{therapist:{gorilla:2,nayuta:1}}, gorillaSecret:1}
      ]
    },
    {
      id: "q3",
      choices: [
        {id:"a", scores:{therapist:{nayuta:2},route:{love:1}}},
        {id:"b", scores:{therapist:{gorilla:2},route:{date:2}}, gorillaSecret:1},
        {id:"c", scores:{route:{adult:1,love:1}}}
      ]
    },
    {
      id: "q4",
      choices: [
        {id:"a", scores:{therapist:{nayuta:2},route:{date:2}}},
        {id:"b", scores:{therapist:{gorilla:2,nayuta:1},route:{date:2}}, gorillaSecret:2},
        {id:"c", scores:{route:{adult:3},therapist:{gorilla:1}}, gorillaSecret:1}
      ]
    },
    {
      id: "q5",
      choices: [
        {id:"a", scores:{therapist:{nayuta:2},route:{love:3}}},
        {id:"b", scores:{route:{love:2,adult:1}}},
        {id:"c", scores:{therapist:{gorilla:4},route:{love:1,date:1}}, gorillaSecret:3}
      ]
    },
    {
      id: "q6",
      choices: [
        {id:"a", scores:{therapist:{nayuta:3},route:{love:2}}},
        {id:"b", scores:{therapist:{gorilla:4},route:{adult:2}}, gorillaSecret:3},
        {id:"c", scores:{route:{adult:2},therapist:{gorilla:1}}, gorillaSecret:1}
      ]
    },
    {
      id: "q7",
      choices: [
        {id:"a", scores:{route:{date:3}}},
        {id:"b", scores:{route:{love:3},therapist:{nayuta:1}}},
        {id:"c", scores:{route:{adult:4}}, gorillaSecret:1}
      ]
    },
    {
      id: "q8",
      choices: [
        {id:"a", scores:{therapist:{nayuta:4}}, tie:{therapist:"nayuta"}},
        {id:"b", scores:{therapist:{gorilla:4}}, tie:{therapist:"gorilla"}, gorillaSecret:4},
        {id:"c", scores:{route:{date:1,love:1,adult:1}}}
      ]
    }
  ],

  secretCondition: {
    minimumSecretPoints: 10,
    minimumGorillaPoints: 12
  },

  therapists: {
    nayuta: {
      id: "nayuta",
      profileUrl: "https://www.ame-ha-shizukani.com/%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88%E4%B8%80%E8%A6%A7/%E3%81%AA%E3%82%86%E3%81%9F/",
      endings: {
        date: {
          id:"nayuta_date",
          image:"assets/nayuta/nayuta-01.webp",
          position:"center 33%"
        },
        love: {
          id:"nayuta_love",
          image:"assets/nayuta/nayuta-07.webp",
          position:"center 28%"
        },
        adult: {
          id:"nayuta_night",
          image:"assets/nayuta/nayuta-12.webp",
          position:"center 27%"
        }
      }
    },

    gorilla: {
      id: "gorilla",
      profileUrl: "https://hitotokinorakuen.jimdofree.com/%E3%82%BB%E3%83%A9%E3%83%94%E3%82%B9%E3%83%88/%E9%AD%94%E7%8E%8B-%E6%B3%A1/",
      endings: {
        date: {
          id:"gorilla_date",
          image:"assets/gorilla/gorilla-09.webp",
          position:"center 24%"
        },
        love: {
          id:"gorilla_love",
          image:"assets/gorilla/gorilla-04.webp",
          position:"center 22%"
        },
        adult: {
          id:"gorilla_dark",
          image:"assets/gorilla/gorilla-12.webp",
          position:"center 24%"
        },
        true: {
          id:"gorilla_true",
          image:"assets/gorilla/gorilla-11.webp",
          position:"center 22%"
        }
      }
    }
  }
};
