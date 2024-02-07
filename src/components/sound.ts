// sound.ts
const BGSOUND1 = new Audio('src/assets/Game_Tetris_Loading1.wav');
const BGSOUND2 = new Audio('src/assets/Game_Tetris_Loading2.wav');

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