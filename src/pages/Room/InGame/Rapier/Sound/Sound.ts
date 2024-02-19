const singleComboSound = new Audio('src/assets/sound/Tetris_Combo1.wav');
const doubleComboSound = new Audio('src/assets/sound/Tetris_Combo2.wav');
const tripleComboSound = new Audio('src/assets/sound/Tetris_Combo3.wav');
const explodeSound = new Audio('src/assets/sound/Tetris_Bomb1.wav');
const defeatSound = new Audio('src/assets/sound/Tetris_Defeat2.wav');
const landingSound = new Audio('src/assets/sound/Tetris_Dusted.wav');
const bombSpawnSound = new Audio('src/assets/sound/Tetris_SpawnBomb.wav');
const gameEndSound = new Audio('src/assets/sound/Tetris_GameEnd.wav');
const flipSound = new Audio('src/assets/sound/Tetris_Flip.wav');
const rotateItemSound = new Audio('src/assets/sound/Tetris_Rotate.wav');
const fogSound = new Audio('src/assets/sound/Tetris_Fog.wav');
const blockRotateSound = new Audio('src/assets/sound/Block_Rotate.wav');
const bombExplodeSound = new Audio('src/assets/sound/Tetris_ExplodeBomb.wav');

export function playSingleComboSound() {
    if (singleComboSound) {
        singleComboSound.play();
    }
}

export function playDoubleComboSound() {
    if (doubleComboSound) {
        doubleComboSound.play();
    }
}

export function playTripleComboSound() {
    if (tripleComboSound) {
        tripleComboSound.play();
    }
}

export function playLandingSound() {
    if (landingSound) {
        landingSound.play();
    }
}

export function playExplodeSound() {
    if (explodeSound) {
        explodeSound.play();
    }
}

export function playDefeatSound() {
    if (defeatSound) {
        defeatSound.play();
    }
}

export function playGameEndSound() {
    if (gameEndSound) {
        gameEndSound.play();
    }
}

export function playFlipSound() {
    if (flipSound) {
        flipSound.play();
    }
}

export function playBombExplodeSound() {
    if (bombExplodeSound) {
        bombExplodeSound.play();
    }
}

export function playBombSpawnSound() {
    if (bombSpawnSound) {
        bombSpawnSound.play();
    }
}

export function playRotateSound() {
    if (rotateItemSound) {
        rotateItemSound.play();
    }
}

export function playFogSound() {
    if (fogSound) {
        fogSound.play();
    }
}

export function playBlockRotateSound() {
    if (blockRotateSound) {
        blockRotateSound.play();
    }
}