
import { BlockCreator } from "./BlockCreator";
import { TetrisGame } from "./TetrisGame";
import { TetrisOption } from "./TetrisOption";
import * as RAPIER from "@dimforge/rapier2d";
import * as PIXI from "pixi.js";

export const BlockTypeList = ["I", "O", "T", "S", "Z", "J", "L"] as const;

export type BlockType = typeof BlockTypeList[number];
export type BlockColor = keyof ColorPalette

export class ColorPalette {
    "blue" = [0xf3d9b1, 0x98c1d9, 0x053c5e, 0x1f7a8c];
    "red" = [0xf3d9b1, 0xd90429, 0xef233c, 0xff6363];
    "green" = [0xf3d9b1, 0x056608, 0x2b8135, 0x3c996e];
    "yellow" = [0xf3d9b1, 0xffd166, 0xffed47, 0xffef96];
    "purple" = [0xf3d9b1, 0x6a0572, 0xab83a1, 0xd4a5a5];
    "orange" = [0xf3d9b1, 0xfca311, 0xfea82f, 0xffd151];
    "teal" = [0xf3d9b1, 0x005b5d, 0x009393, 0x66cccc];
    "pink" = [0xf3d9b1, 0xd00000, 0xff4343, 0xff9e9e];
    "brown" = [0xf3d9b1, 0x4e342e, 0x7b5e57, 0xa1887f];
    "indigo" = [0xf3d9b1, 0x303f9f, 0x5c6bc0, 0x9fa8da];
    "lime" = [0xf3d9b1, 0xa8d8ea, 0x92c9b1, 0x7fae92];
    "cyan" = [0xf3d9b1, 0x00acc1, 0x26c6da, 0x4dd0e1];
    "lavender" = [0xf3d9b1, 0x8675a9, 0xa39fc9, 0xc7b2de];
    "mustard" = [0xf3d9b1, 0xffdb58, 0xffe082, 0xffecb3];
    "peach" = [0xf3d9b1, 0xff8c61, 0xffb38a, 0xffdab9];
    "olive" = [0xf3d9b1, 0x607c47, 0x879961, 0xa7b485];
    "magenta" = [0xf3d9b1, 0x8e44ad, 0xc39bd3, 0xe6ccff];
    "maroon" = [0xf3d9b1, 0x800000, 0xa52a2a, 0xb73b3b];
    "gold" = [0xf3d9b1, 0xffd700, 0xffe400, 0xffeb3b];
    "navy" = [0xf3d9b1, 0x001f3f, 0x003366, 0x004080];
}

export const Palette = new ColorPalette();
export const BlockColorList = Object.keys(Palette);

export class Tetromino {
    private _rigidBody: RAPIER.RigidBody;
    private _blockColor: BlockColor;
    private _blockAlpha: number;
    private _type: string;
    private _graphics: PIXI.Graphics[];
    private _context: PIXI.Container;
    private _world: RAPIER.World;
    private _game: TetrisGame;
    public userData: any;

    public constructor(game: TetrisGame, option: TetrisOption, world: RAPIER.World, ctx: PIXI.Container, rigidBody?: RAPIER.RigidBody, blockColor?: BlockColor, blockAlpha?: number, blockType?: BlockType) {
        this._game = game;
        this._world = world;
        this._blockAlpha = blockAlpha!;
        this._blockColor = blockColor!;
        this._type = blockType!;
        this._context = ctx;
        this._graphics = [];
        if (!rigidBody) {
            this._rigidBody = this.createTetromino(option, blockType);
            return;
        }

        this._rigidBody = rigidBody;
    }

    private createTetromino(option: TetrisOption, blockType?: BlockType) {
        if (!blockType) {
            throw new Error("Failed to create tetromino: blockType is undefined.");
        }
        
        const spawnX = option.spawnX ?? 0;
        const spawnY = option.spawnY ?? 0;
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(spawnX, spawnY);
        const rigidBody = this._world.createRigidBody(bodyDesc);

        BlockCreator.createTetromino(option.blockSize, blockType).forEach((value) => {
            this._world.createCollider(value, rigidBody).setRestitution(0);
        });

        return rigidBody;
    }

    public addGraphics(graphics: PIXI.Graphics) {
        this._graphics.push(graphics);
    }

    public get graphics() {
        return this._graphics;
    }
    
    public set graphics(graphics: PIXI.Graphics[]) {
        this._graphics = graphics;
    }
    
    public get alpha() {
        return this._blockAlpha;
    }

    public get fillStyle() {
        return this._blockColor;
    }

    public get type() {
        return this._type;
    }

    public get rigidBody() {
        return this._rigidBody;
    }

    public remove() {
        this._graphics.forEach((value) => {
            this._context.removeChild(value);
        });

        // TODO: At some point, we will have to delete a block.
        this._rigidBody.setTranslation({x: 10000, y: 0}, false);
        this._game.addRigidBodyToRemoveQueue(this._rigidBody);
    }
}