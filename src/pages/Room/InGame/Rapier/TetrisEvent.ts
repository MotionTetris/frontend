import { TetrisGame } from "./TetrisGame";
import { BlockColor, BlockType } from "./Tetromino";
import { FallableItemType } from "./Object/ItemFactory";

export interface BlockCollisionEvent extends GameEvent {
    bodyA: any;
    bodyB: any;
}

export interface StepEvent extends GameEvent {
    currentStep: number;
}

export interface BlockSpawnEvent extends GameEvent {
    blockType: BlockType;
    blockColor: BlockColor;
    nextBlockType: BlockType;
    nextBlockColor: BlockColor;
}

export interface ItemSpawnEvent extends GameEvent {
    item: FallableItemType;
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
    "itemSpawn": ItemSpawnEvent;
    "pause": GameEvent;
    "resume": GameEvent;
}