import { World } from "@dimforge/rapier2d";
import { Container, DisplayObject } from "pixi.js";
import { TetrisGame } from "../TetrisGame";
import { TetrisOption } from "../TetrisOption";
import { Weight } from "./Weight";
import { Tetromino } from "../Tetromino";
import { Bomb } from "./Bomb";

export type Fallable = Tetromino | FallableItemType
export type FallableItemType = "weight" | "bomb";
export const FallableItemMap =  {
    weight: (game: TetrisGame, option: TetrisOption, world: World, ctx: Container<DisplayObject>, width: number, height: number) => new Weight(game, option, world, ctx, width, height),
    bomb: (game: TetrisGame, option: TetrisOption, world: World, ctx: Container<DisplayObject>, width: number, height: number) => new Bomb(game, option, world, ctx, width, height),
}

export function createItem(type: FallableItemType) {
    if (typeof FallableItemMap[type] !== 'function') {
        throw new Error(`Invalid type ${type}`);
    }

    return FallableItemMap[type];
}

