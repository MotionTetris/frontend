const singleComboSound = new Audio('src/assets/sound/Tetris_combo1.wav');
const doubleComboSound = new Audio('src/assets/sound/Tetris_combo2.wav');
const tripleComboSound = new Audio('src/assets/sound/Tetris_combo3.wav');
const explodeSound = new Audio('src/assets/sound/Tetris_Bomb1.wav');
const defeatSound = new Audio('src/assets/sound/Tetris_Defeat2.wav');
const ingameSound = new Audio('src/assets/sound/Tetris_Ingame2.wav');
const loadingSound = new Audio('src/assets/sound/Tetris_Loading2.wav');
const landingSound = new Audio('src/assets/sound/Tetris_Dusted.wav');

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


export function playLoadingSound() {
    if (loadingSound) {
        loadingSound.play();
    }
}


export function playIngameSound() {
    if (ingameSound) {
        ingameSound.loop = true; 
        ingameSound.play();
    }
}