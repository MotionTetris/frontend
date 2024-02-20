import * as PIXI from 'pixi.js';
import FogEffect from '@assets/items/SmokeEffect.png';
import ExplosionEffect from '@assets/explosion.png';
import BombImage from '@assets/items/Bomb.png';
import RockImage from '@assets/items/Stone.png';

export class EffectLoader {
    static textures: Map<string, PIXI.Texture> = new Map();
    static async loadTextrue(url: string) {
        const texture = this.textures.get(url);
        if (!texture) {
            this.textures.set(url, await PIXI.Texture.fromURL(url));
            console.debug(this.textures);
        }
    }

    static async loadSprite(sheetUrl: string, spriteNames: string[]) {
        await PIXI.Assets.load(sheetUrl, (progress) => {
            console.log(`load sprite ${sheetUrl} ${progress * 100}%`);
        });
        for (const spriteName of spriteNames) {
            const texture = PIXI.Texture.from(spriteName);
            this.textures.set(spriteName, texture);
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
    await EffectLoader.loadTextrue(RockImage);
    const Explosion_Sequence_A = [];
    for (let i = 0; i < 26; i++) {
        Explosion_Sequence_A.push(`Explosion_Sequence_A ${i + 1}.png`);
    }
    EffectLoader.loadSprite('/assets/spritesheet/mc.json', Explosion_Sequence_A);
}