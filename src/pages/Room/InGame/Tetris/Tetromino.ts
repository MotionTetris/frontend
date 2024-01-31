import Matter from "matter-js";
import TetrisGame, { TetrisOption } from "./TetrisGame";
import { BlockColorList, BlockCreator, BlockTypeList } from "./BlockCreator";
import { IObject } from "./IObject";

export class Tetromino implements IObject {
    private _rigidBody: Matter.Body;
    private _game: TetrisGame;
    private landingSound?: HTMLAudioElement;

    public constructor(game: TetrisGame, option: TetrisOption, blocktype:number, fillstyle: number, rigidBody?: Matter.Body) {
        this._game = game;

        const type = this.getRandomBlockType(blocktype);
        const fillStyle = this.getRandomFillStyle(fillstyle);
        const spwanX = option.spawnX ?? 0;
        const spwanY = option.spawnY ?? 0;

        if (rigidBody) {
            this._rigidBody = rigidBody;
        } else {
            this._rigidBody = BlockCreator.create(spwanX, spwanY, {
                friction: option.blockFriction,
                restitution: option.blockRestitution,
                size: option.blockSize,
                // @ts-ignore
                type: type,
                fillStyle: fillStyle
            });
        }
    }

    public get rigidBody() {
        return this._rigidBody;
    }

    public update() {

    }

    public remove() {

    }
    
    private getRandomBlockType(index: number) {
        const blockTypes = BlockTypeList;
        return blockTypes[index];
    }
    
    private getRandomFillStyle(index: number) {
        const fillStyles = BlockColorList;
        return fillStyles[index];
    }


}