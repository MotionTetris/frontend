import { World } from "@dimforge/rapier2d";
import { Container, DisplayObject } from "pixi.js";
import { TetrisGame } from "../TetrisGame";
import { TetrisOption } from "../TetrisOption";
import { Rock } from "./Rock";
import { Tetromino } from "./Tetromino";
import { Bomb } from "./Bomb";
import { playBombSpawnSound } from "../Sound/Sound";

export type Fallable = Tetromino | FallableItemType
export type FallableItemType = "rock" | "bomb";
export const FallableItemMap =  {
    rock: (game: TetrisGame, option: TetrisOption, world: World, ctx: Container<DisplayObject>, width: number, height: number) => new Rock(game, option, world, ctx, width, height),
    bomb: (game: TetrisGame, option: TetrisOption, world: World, ctx: Container<DisplayObject>, width: number, height: number) => new Bomb(game, option, world, ctx, width, height),
}

export const ItemSpawnSoundMap = {
    rock: () => {},
    bomb: () => playBombSpawnSound()
}

export function createItem(type: FallableItemType) {
    if (typeof FallableItemMap[type] !== 'function') {
        throw new Error(`Invalid type ${type}`);
    }

    return FallableItemMap[type];
}

export function playItemSpawnSound(type: FallableItemType) {
    if (typeof FallableItemMap[type] !== 'function') {
        throw new Error(`Invalid type ${type}`);
    }
    
    return ItemSpawnSoundMap[type];
}
