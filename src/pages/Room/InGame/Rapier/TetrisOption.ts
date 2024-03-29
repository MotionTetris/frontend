import { BlockColor } from "./Object/Tetromino";

export interface TetrisOption {
    wallColor?: BlockColor;
    wallAlpha?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    spawnX?: number;
    spawnY?: number;
    blockFriction: number;
    blockRestitution: number;
    blockSize: number;
    combineDistance: number;
    view: HTMLCanvasElement;
    worldWidth: number;
    worldHeight: number;
}
