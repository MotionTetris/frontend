import { TetrisGame } from "./TetrisGame";
import { BlockType } from "./Tetromino";

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
    blockSpawnCallback?: (game: TetrisGame, blockType: BlockType) => void;
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
