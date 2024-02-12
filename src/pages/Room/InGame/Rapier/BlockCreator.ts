import { LinearAlgebra } from "./LinearAlgebra";
import { BlockType } from "./Tetromino";
import * as RAPIER from "@dimforge/rapier2d";

export class BlockCreator {
    public static createTetromino(blockSize: number, blockType: BlockType) {
        let block = undefined;
        switch (blockType) {
            case "I":
                block = this.createI(blockSize / 2);
                break;
            case "O":
                block = this.createO(blockSize / 2);
                break;
            case "T":
                block = this.createT(blockSize / 2);
                break;
            case "S":
                block = this.createS(blockSize / 2);
                break;
            case "Z":
                block = this.createZ(blockSize / 2);
                break;
            case "J":
                block = this.createJ(blockSize / 2);
                break;
            case "L":
                block = this.createL(blockSize / 2);
                break;
            default:
                throw new Error("Failed to create block: Unkown block type");
        }

        for (let i = 0; i < block.length; i++) {
            block[i].setRestitution(0).setFriction(1.0);
        }

        return block;
    }

    public static createPolygon(x: number, y: number, coords: Float32Array | number[]) {
        const center = LinearAlgebra.center(coords);
        for (let i = 0; i < coords.length; i += 2) {
            coords[i] -= center[0];
            coords[i + 1] -= center[1];
        }
        
        return RAPIER.ColliderDesc.convexHull(new Float32Array(coords))?.setTranslation(x, y);
    }

    public static createRawPolygon(coords: Array<number>) {
        return RAPIER.ColliderDesc.convexHull(new Float32Array(coords));
    }

    private static createRectangle(rad: number) {
        return RAPIER.ColliderDesc.convexHull(new Float32Array([
            -rad, -rad,
            -rad, +rad,
            +rad, +rad,
            +rad, -rad  
        ]));
    }

    public static createO(rad: number) {
        const colliderDesc1 = this.createRectangle(rad)!.setTranslation(2 * rad, 0);
        const colliderDesc2 = this.createRectangle(rad)!.setTranslation(0, 2 * rad);
        const colliderDesc3 = this.createRectangle(rad)!.setTranslation(2 * rad, 2 * rad);
        const colliderDesc4 = this.createRectangle(rad)!.setTranslation(0, 0);
        return [colliderDesc1, colliderDesc2, colliderDesc3, colliderDesc4];
    }

    public static createI(rad: number) {
        const colliderDesc1 = this.createRectangle(rad)!.setTranslation(0, 0);
        const colliderDesc2 = this.createRectangle(rad)!.setTranslation(0, 1 * 2 * rad);
        const colliderDesc3 = this.createRectangle(rad)!.setTranslation(0, 2 * 2 * rad);
        const colliderDesc4 = this.createRectangle(rad)!.setTranslation(0, 3 * 2 * rad);
        return [colliderDesc1, colliderDesc2, colliderDesc3, colliderDesc4];
    }

    public static createT(rad: number) {
        const colliderDesc1 = this.createRectangle(rad)!.setTranslation(0, 0);
        const colliderDesc2 = this.createRectangle(rad)!.setTranslation(2 * rad, 0);
        const colliderDesc3 = this.createRectangle(rad)!.setTranslation(-2 * rad, 0);
        const colliderDesc4 = this.createRectangle(rad)!.setTranslation(0, 2 * rad);
        return [colliderDesc1, colliderDesc2, colliderDesc3, colliderDesc4];
    }

    public static createS(rad: number) {
        const colliderDesc1 = this.createRectangle(rad)!.setTranslation(0, 0);
        const colliderDesc2 = this.createRectangle(rad)!.setTranslation(-2 * rad, 0);
        const colliderDesc3 = this.createRectangle(rad)!.setTranslation(2 * rad, 2 * rad);
        const colliderDesc4 = this.createRectangle(rad)!.setTranslation(0, 2 * rad);
        return [colliderDesc1, colliderDesc2, colliderDesc3, colliderDesc4];
    }

    public static createZ(rad: number) {
        const colliderDesc1 = this.createRectangle(rad)!.setTranslation(0, 0);
        const colliderDesc2 = this.createRectangle(rad)!.setTranslation(2 * rad, 0);
        const colliderDesc3 = this.createRectangle(rad)!.setTranslation(-2 * rad, 2 * rad);
        const colliderDesc4 = this.createRectangle(rad)!.setTranslation(0, 2 * rad);
        return [colliderDesc1, colliderDesc2, colliderDesc3, colliderDesc4];
    }

    public static createL(rad: number) {
        const colliderDesc1 = this.createRectangle(rad)!.setTranslation(2 * rad, 2 * rad);
        const colliderDesc2 = this.createRectangle(rad)!.setTranslation(0, 1 * 2 * rad);
        const colliderDesc3 = this.createRectangle(rad)!.setTranslation(0, 2 * 2 * rad);
        const colliderDesc4 = this.createRectangle(rad)!.setTranslation(0, 3 * 2 * rad);
        return [colliderDesc1, colliderDesc2, colliderDesc3, colliderDesc4];
    }

    public static createJ(rad: number) {
        const colliderDesc1 = this.createRectangle(rad)!.setTranslation(-2 * rad, 2 * rad);
        const colliderDesc2 = this.createRectangle(rad)!.setTranslation(0, 1 * 2 * rad);
        const colliderDesc3 = this.createRectangle(rad)!.setTranslation(0, 2 * 2 * rad);
        const colliderDesc4 = this.createRectangle(rad)!.setTranslation(0, 3 * 2 * rad);
        return [colliderDesc1, colliderDesc2, colliderDesc3, colliderDesc4];
    }
}
