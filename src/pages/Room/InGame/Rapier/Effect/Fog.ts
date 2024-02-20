import * as PIXI from 'pixi.js';
import { EffectLoader } from './EffectLoader';
import FogEffect from '@assets/items/SmokeEffect.png';
import { IEffect } from './IEffect';

export class Fog implements IEffect {
    private _particles: PIXI.Sprite[];
    private _speed: number;
    private _x: number;
    private _y: number;
    private _isDamping: boolean;
    private _isDone: boolean;
    public constructor(x: number, y: number, rx: number, ry: number, numParticle: number, speed: number) {
        this._particles = [];
        this._x = x;
        this._y = y;

        let texture: PIXI.Texture<PIXI.Resource> | undefined;
        if (!(texture = EffectLoader.getTexture(FogEffect))) {
            throw new Error("Failed to create fog. textrue is not loaded.");
        }

        for (let i = 0; i < numParticle; i++) {
            const particle = new PIXI.Sprite(texture);
            particle.position.set(x + Math.random() * rx, y + Math.random() * ry);
            particle.anchor.set(0.5, 0.5);
            particle.rotation = Math.random() * 360;
            particle.alpha = 0;
            particle.blendMode = PIXI.BLEND_MODES.SCREEN;
            particle.tint = 0xffffff;
            this._particles.push(particle);
        }

        this._speed = speed;
        this._isDamping = false;
        this._isDone = false;
    }

    init(): void {
        this._isDamping = false;
        for (let i = 0; i < this._particles.length; i++) {
            this._particles[i].alpha = 0;
        }
        this._isDone = false;
    }

    animate(delta: number): void {
        if (this._isDone) {
            return;
        }

        if (this._isDamping) {
            for (let i = 0; i < this._particles.length; i++) {
                this._particles[i].alpha = Math.max(0, this._particles[i].alpha - delta * this._speed);
                this._particles[i].rotation += (delta * this._speed);
            }

            if (this._particles[0].alpha <= 0) {
                this._isDone = true;
            }
            return;
        }

        for (let i = 0; i < this._particles.length; i++) {
            this._particles[i].alpha = Math.min(1, this._particles[i].alpha + delta * this._speed);
            this._particles[i].rotation += (delta * this._speed);
        }

        if (this._particles[0].alpha >= 1) {
            this._isDamping = true;
        }
    }

    addTo(container: PIXI.Container<PIXI.DisplayObject>): void {
        for (let i = 0; i < this._particles.length; i++) {
            container.addChild(this._particles[i]);
        }
    }

    removeFrom(container: PIXI.Container<PIXI.DisplayObject>): void {
        for (let i = 0; i < this._particles.length; i++) {
            container.removeChild(this._particles[i]);
        }
    }

    dispose(): void {
        for (let i = 0; i < this._particles.length; i++) {
            this._particles[i].destroy();
        }
    }

    translate(x: number, y: number): void {
        this._x = x;
        this._y = y;
        for (let i = 0; i < this._particles.length; i++) {
            const pos = this._particles[i].position;
            this._particles[i].position.x = pos.x + x;
            this._particles[i].position.y = pos.y + y;
        }
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