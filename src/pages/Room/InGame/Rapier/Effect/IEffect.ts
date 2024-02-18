import * as PIXI from 'pixi.js';

export interface IEffect {
    animate(delta: number): void;
    addTo(container: PIXI.Container, delay: number): void;
    removeFrom(container: PIXI.Container, delay: number): void;
    dispose(): void;
    translate(x: number, y: number): void;
    init(): void;
}