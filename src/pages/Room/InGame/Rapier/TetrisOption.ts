import { TetrisGame } from "./TetrisGame";

export interface BlockCollisionCallbackParam {
    game: TetrisGame,
    bodyA: any;
    bodyB: any;
}

export interface TetrisOption {
    blockCollisionCallback?: (result: BlockCollisionCallbackParam) => void;
    blockLandingCallback?: (result: BlockCollisionCallbackParam) => void;
    preBlockLandingCallback?: (result: BlockCollisionCallbackParam) => void;
    blockFriction: number;
    blockRestitution: number;
    blockSize: number;
    spawnX?: number;
    spawnY?: number;
    combineDistance: number;
    view: HTMLCanvasElement;
    worldWidth: number;
    worldHeight: number;
}
