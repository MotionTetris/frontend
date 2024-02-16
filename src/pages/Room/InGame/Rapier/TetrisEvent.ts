import { TetrisGame } from "./TetrisGame";
import { BlockType } from "./Tetromino";

export interface BlockCollisionEvent extends GameEvent {
    bodyA: any;
    bodyB: any;
}

export interface StepEvent extends GameEvent {
    currentStep: number;
}

export interface BlockSpawnEvent extends GameEvent {
    blockType: BlockType;
    blockColor: number;
    nextBlockType: BlockType;
    nextBlockColor: number;
}

export interface GameEvent {
    game: TetrisGame;
}

export interface TetrisEventMap {
    "landing": BlockCollisionEvent;
    "prelanding": BlockCollisionEvent;
    "collision": BlockCollisionEvent;
    "step": StepEvent;
    "blockSpawn": BlockSpawnEvent;
    "pause": GameEvent;
    "resume": GameEvent;
}