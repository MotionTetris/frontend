import * as PIXI from "pixi.js";
import RAPIER from "@dimforge/rapier2d";
import { playBombSpawnSound, playFlipSound, playFogSound, playRotateSound } from "./Sound/Sound";
import { TetrisGame } from "./TetrisGame";
import { Viewport } from "pixi-viewport";
import * as particles from '@pixi/particle-emitter'
import BOMB_IMG from '@assets/items/Bomb.png';
import { BOMB_URL, FOG_URL, FLIP_URL, ROTATE_LEFT_URL, ROTATE_RIGHT_URL, ROCK_URL } from "../../../../config"
import { EffectLoader } from "./Effect/EffectLoader";
import { Fog } from "./Effect/Fog";

export function applyItem(game: TetrisGame, item: string) {
    switch(item) {
        case "FOG":
            addFog(game);
            break;
        case "FLIP":
            flipViewport(game.graphics.viewport);
            break;
        case "ROTATE_RIGHT":
            rotateViewport(game.graphics.viewport, 15);
            break;
        case "ROTATE_LEFT":
            rotateViewport(game.graphics.viewport, -15);
            break;
        default:
            console.log('Invalid index');
    }
}


export function getItemUrl(item: string): string {
    let itemUrl: string;
    switch (item) {
        case "BOMB":
            itemUrl = BOMB_URL;
            break;
        case "ROCK":
            itemUrl = ROCK_URL;
            break;
        case "FOG":
            itemUrl = FOG_URL;
            break;
        case "FLIP":
            itemUrl = FLIP_URL;
            break;
        case "ROTATE_RIGHT":
            itemUrl = ROTATE_RIGHT_URL;
            break;
        case "ROTATE_LEFT":
            itemUrl = ROTATE_LEFT_URL;
            break;
        default:
            itemUrl = "";
            break;
    }
    return itemUrl;
}

export function rotateViewport(viewport: Viewport, degree: number) {
    playRotateSound();
    const angleInRadians = degree * (Math.PI / 180);
    viewport.rotation = angleInRadians;
    viewport.scale.x *= 0.8;
    viewport.scale.y *= 0.8;
    if (degree >= 0) {
        viewport.x += 200;
    }
    
    setTimeout(() => {
        resetRotateViewport(viewport);
    }, 5000);
}


export function resetRotateViewport(viewport: Viewport) {
    viewport.rotation = 0;
    viewport.scale.x = 1;
    viewport.scale.y = 1;
    viewport.x = 0;;
}


export function flipViewport(viewport: Viewport) {
    playFlipSound();
    viewport.scale.x = -1;
    viewport.x += 500;
    setTimeout(() => {
        resetFlipViewport(viewport);
    }, 5000);
}

export function resetFlipViewport(viewport: Viewport) {
    viewport.scale.x = 1;
    viewport.x = 0;
}


export function addFog(game: TetrisGame) {
    playFogSound();
    let fog = new Fog(100, 300, 300, 300, 100, 0.0025);
    fog.addTo(game.graphics.effectScene);
    const fogAnimation = (dt: number) => {
      fog.animate(dt);
      if (fog.isDone) {
        game.graphics.ticker.remove(fogAnimation);
        fog.init();
      }
    }
    game.graphics.ticker.add(fogAnimation)
    game.graphics.ticker.start();
};