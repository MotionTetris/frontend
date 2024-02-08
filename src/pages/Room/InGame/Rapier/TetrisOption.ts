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
    stepCallback?: (game: TetrisGame, currentStep: number) => void;
    wallColor?: number;
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
