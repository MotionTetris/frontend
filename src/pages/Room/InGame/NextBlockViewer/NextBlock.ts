
import { BlockColor, BlockType, Palette } from "../Rapier/Tetromino";
import * as PIXI from 'pixi.js';

/* Duplicated with BlockCreator but we leave it. */
const getBlockInfo = (rad: number) => (blockType: BlockType) => {
    switch (blockType) {
        case "I":
            return [-2 * rad, rad,
                    0, rad,
                    2 * rad, rad, 
                    4 * rad, rad];
        case "O":
            return [2 * rad, 0,
                    0, 2 * rad,
                    2 * rad, 2 * rad,
                    0, 0];
        case "T":
            return [0, 0,
                    2 * rad, 0,
                    -2 * rad, 0,
                    0, 2 * rad];
        case "S":
            return [0, 0,
                    -2 * rad, 0,
                    2 * rad, 2 * rad,
                    0, 2 * rad];
        case "Z":
            return [0, 0,
                    2 * rad, 0,
                    -2 * rad, 2 * rad,
                    0, 2 * rad];
        case "J":
            return [-2 * rad, 0,
                    0, 0,
                    0, 2 * rad,
                    0, 4 * rad];
        case "L":
            return [2 * rad, 0,
                    0, 0,
                    0, 2 * rad,
                    0, 4 * rad];
        default:
            throw new Error("Unkown BlockInfo");
    }
}

export const drawBlock = (size: number) => { 
    let blockInfo = getBlockInfo(size / 2);
    return (app: PIXI.Application, x: number, y: number, blockType: BlockType, blockColor: BlockColor) => {
        const translationInfo = blockInfo(blockType);
        const colorPalette = Palette[blockColor];
        let colorIndex = 0;
        
        for (let i = 0; i < translationInfo.length; i += 2) {
            colorIndex += 1;
            let graphics = new PIXI.Graphics();
            graphics.beginFill(colorPalette[colorIndex]);
            graphics.drawRect(0, 0, 2.0, 2.0);
            graphics.scale.x = size / 2;
            graphics.scale.y = size / 2;
            graphics.position.x = translationInfo[i] + x;
            graphics.position.y = translationInfo[i + 1] + y;
            app.stage.addChild(graphics);
            colorIndex = (colorIndex + 1) % (colorPalette.length - 1);
        }
    } 
}

export function clearBlock(app: PIXI.Application) {
    app.stage.removeChildren();
}