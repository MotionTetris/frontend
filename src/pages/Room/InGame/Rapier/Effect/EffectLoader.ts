import * as PIXI from 'pixi.js';
import FogEffect from '@assets/items/SmokeEffect.png';
import ExplosionEffect from '@assets/explosion.png';
import BombImage from '@assets/items/Bomb.png';

export class EffectLoader {
    static textures: Map<string, PIXI.Texture> = new Map();
    static async loadTextrue(url: string) {
        let texture = this.textures.get(url);
        if (!texture) {
            this.textures.set(url, await PIXI.Texture.fromURL(url));
            console.debug(this.textures);
        }
    }

    static getTexture(url: string) {
        return this.textures.get(url);
    }

    static removeTexture(url: string) {
        this.textures.delete(url);
    }
}

export async function loadEffect() {
    await EffectLoader.loadTextrue(FogEffect);
    await EffectLoader.loadTextrue(ExplosionEffect);
    await EffectLoader.loadTextrue(BombImage);
}