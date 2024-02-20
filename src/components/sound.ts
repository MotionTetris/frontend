const BGSOUND1 = new Audio('src/assets/Game_Tetris_Loading1.wav');
const BGSOUND2 = new Audio('src/assets/Game_Tetris_Loading2.wav');
const INGAME_SOUND = new Audio('src/assets/sound/Tetris_Ingame2.wav');
const ROOMSOUND = new Audio('src/assets/sound/Tetris_Ingame1.wav');
const LOGINSOUND = new Audio('src/assets/sound/Home_Login.wav');
const READYSOUND = new Audio('src/assets/sound/Room_Ready.wav');
const STARTSOUND = new Audio('src/assets/sound/Room_Start.wav')
export type PageBGM = "page1" | "page2" | "ingame" | "room";

export function playSound(page: PageBGM, volume: number, play = true) {
  switch (page) {
    case "page1":
      playLodingSound1(volume, play);
      break;
    case "page2":
      playLodingSound2(volume, play);
      break;
    case "ingame":
      playIngameSound(volume, play);
      break;
    case "room": 
      playRoomSound(volume, play);
      break;
  }
}

export function stopSound() {
  BGSOUND1.pause();
  BGSOUND1.currentTime = 0;
  BGSOUND2.pause();
  BGSOUND2.currentTime = 0;
  INGAME_SOUND.pause();
  INGAME_SOUND.currentTime = 0;
  ROOMSOUND.pause();
  ROOMSOUND.currentTime = 0;
}

function playLodingSound1(volume: number, play = true) {
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

function playLodingSound2(volume: number, play = true) {
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

function playIngameSound(volume: number, play = true) {
  if (INGAME_SOUND) {
    INGAME_SOUND.loop = true; 
    INGAME_SOUND.volume = volume;
    if (play) {
      INGAME_SOUND.play();
    } else {
      INGAME_SOUND.pause();
    }
  }
}


export function changeIngameSoundSpeed(speed: number) {
  if (INGAME_SOUND) {
    INGAME_SOUND.playbackRate = speed;
  }
}

export function playRoomSound(volume: number, play = true) {
  if (ROOMSOUND) {
      ROOMSOUND.loop = true;
      ROOMSOUND.volume = volume;
      if (play) {
        ROOMSOUND.play();
      }
      else {
        ROOMSOUND.pause();
      }
  }
}

export function playLoginSound() {
  if (LOGINSOUND) {
    LOGINSOUND.play();
  }
}

export function playReadySound() {
  if (READYSOUND) {
    READYSOUND.play();
  }
}

export function playStartSound() {
  if (STARTSOUND) {
    STARTSOUND.play();
  }
}