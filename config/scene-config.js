/*
============================================================
  背景・立ち絵設定
============================================================

文章ではなく「どの画像を使うか」だけを管理します。

基本は触らなくてもOKです。
背景や立ち絵を後から差し替える場合だけ、このファイルを編集します。
============================================================
*/

window.SCENE_CONFIG = {

  backgrounds: {
    cityDay:   "assets/backgrounds/city-day.webp",
    cafe:      "assets/backgrounds/cafe.webp",
    cityNight: "assets/backgrounds/city-night.webp",
    hotel:     "assets/backgrounds/hotel.webp",
    gym:       "assets/backgrounds/gym.webp"
  },

  standing: {
    nayuta: {
      src: "assets/standing/nayuta/normal.png",
      alt: "なゆた",
      scale: 0.88,
      x: 50,
      y: 100
    },

    gorilla: {
      src: "assets/standing/gorilla/normal.png",
      alt: "ゴリラ",
      scale: 0.91,
      x: 50,
      y: 100
    }
  },

  routes: {
    nayuta: {
      date: {
        openingBackground: "cityDay",
        secondBackground: "cafe"
      },
      love: {
        openingBackground: "cafe",
        secondBackground: "cityNight"
      },
      adult: {
        openingBackground: "cityNight",
        secondBackground: "hotel"
      }
    },

    gorilla: {
      date: {
        openingBackground: "gym",
        secondBackground: "cityDay"
      },
      love: {
        openingBackground: "cafe",
        secondBackground: "gym"
      },
      adult: {
        openingBackground: "hotel",
        secondBackground: "hotel"
      },
      true: {
        openingBackground: "cityNight",
        secondBackground: "gym"
      }
    }
  }
};
