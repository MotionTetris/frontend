const BGSOUND1 = new Audio('src/assets/Game_Tetris_Loading1.wav');
const BGSOUND2 = new Audio('src/assets/Game_Tetris_Loading2.wav');

export type PageBGM = "page1" | "page2";

export function playSound(page: PageBGM, volume: number, play = true) {
  switch (page) {
    case "page1":
      playLodingSound1(volume, play);
      break;
    case "page2":
      playLodingSound2(volume, play);
      break;
  }
}

export function stopSound() {
  BGSOUND1.pause();
  BGSOUND1.currentTime = 0;
  BGSOUND2.pause();
  BGSOUND2.currentTime = 0;
}

export function playLodingSound1(volume: number, play = true) {
  if (BGSOUND1) {
    BGSOUND1.loop = true;
    BGSOUND1.volume = volume;
    if (play) {
      BGSOUND1.play();
    } else {
      BGSOUND1.pause();
    }
  }
}

export function playLodingSound2(volume: number, play = true) {
  if (BGSOUND2) {
    BGSOUND2.loop = true;
    BGSOUND2.volume = volume;
    if (play) {
      BGSOUND2.play();
    } else {
      BGSOUND2.pause();
    }
  }
}
