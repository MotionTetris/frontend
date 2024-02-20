import * as PIXI from 'pixi.js';
import { EffectLoader } from './EffectLoader';
import { IEffect } from './IEffect';

export class Explosion implements IEffect {
    private _explosion: PIXI.AnimatedSprite;
    private _x: number;
    private _y: number;
    private _explosionTextures: PIXI.Texture[];
    private _isDone: boolean;
    public constructor(x: number, y: number, scale: number) {
        this._x = x;
        this._y = y;
        this._explosionTextures = [];

        for (let i = 0; i < 26; i++) {
            const texture = EffectLoader.getTexture(`Explosion_Sequence_A ${i + 1}.png`);
            if (!texture) {
                console.error(`Failed to load texture Explosion_Sequence_A ${i + 1}.png`);
                continue;
            }
            this._explosionTextures.push(texture);
        }

        this._explosion = new PIXI.AnimatedSprite(this._explosionTextures);
        this._explosion.x = x;
        this._explosion.y = -y;
        this._explosion.anchor.set(0.5, 0.5);
        this._explosion.rotation = Math.random() * Math.PI;
        this._explosion.scale.set(scale);

        this._isDone = false;
    }

    init(): void {
        this._isDone = false;
    }

    animate(delta: number): void {
        this._explosion.loop = false;
        this._explosion.onComplete = () => {
            this._isDone = true;
        };
        this._explosion.gotoAndPlay(0);
    }

    addTo(container: PIXI.Container<PIXI.DisplayObject>): void {
        container.addChild(this._explosion);
    }

    removeFrom(container: PIXI.Container<PIXI.DisplayObject>): void {
        container.removeChild(this._explosion);
    }

    dispose(): void {
        this._explosion.destroy();
    }

    translate(x: number, y: number): void {
        this._x = x;
        this._y = y;
        this._explosion.x = x;
        this._explosion.y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get isDone() {
        return this._isDone;
    }
}