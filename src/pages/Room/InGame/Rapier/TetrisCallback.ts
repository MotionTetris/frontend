import { Socket } from "socket.io-client";
import { changeBlockGlow, collisionParticleEffect, fallingBlockGlow, handleComboEffect, loadStarImage, performPushEffect, starParticleEffect } from "./Effect";
import { KeyPointCallback, KeyPoint } from "./PostNet";
import { TetrisGame } from "./TetrisGame";
import { playDefeatSound, playExplodeSound, playLandingSound } from "./Sound";
import * as PIXI from "pixi.js";
import { BlockType, BlockTypeList } from "./Tetromino";
import { randomInt } from "crypto";

export function createUserEventCallback(game: TetrisGame, socket?: Socket) {
    let nextColorIndex = 0;
    let eventCallback: KeyPointCallback = {
        onRotateLeft: function (keypoints: Map<string, KeyPoint>): void {
            nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
            let event = game.onRotateLeft();
            socket?.emit('eventOn', event);
        },
        onRotateRight: function (keypoints: Map<string, KeyPoint>): void {
            nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
            const event = game.onRotateRight();
            socket?.emit('eventOn', event);
        },
        onMoveLeft: function (keypoints: Map<string, KeyPoint>): void {
            let centerX = keypoints.get("center")?.x;
            let nose = keypoints.get("nose");
            if (!nose || !centerX) {
                return;
            }
            let alpha = (nose.x - centerX) / 300;
            let forceMagnitude = Math.abs(nose.x - centerX) / (centerX);
            performPushEffect(game.graphics.rectangles[0], game.graphics.rectangles[1], alpha, 80, 470);
            const event = game.onMoveLeft(forceMagnitude);
            socket?.emit('eventOn', event);
        },
        onMoveRight: function (keypoints: Map<string, KeyPoint>): void {
            let centerX = keypoints.get("center")?.x;
            let nose = keypoints.get("nose");
            if (!nose || !centerX) {
                return;
            }
            let alpha = (nose.x - centerX) / 300;
            let forceMagnitude = Math.abs(nose.x - centerX) / (centerX);
            performPushEffect(game.graphics.rectangles[1], game.graphics.rectangles[0], alpha, 470, 80);
            const event = game.onMoveRight(forceMagnitude);
            socket?.emit('eventOn', event);
        }
    }
    return eventCallback;
}

export function createBlockSpawnEvent(socket?: Socket) {
    return (game: TetrisGame, blockType: BlockType, blockColor: number) => {
        let event = game.onBlockSpawned(blockType, blockColor);
        socket?.emit('eventOn', event);
    }
}

export function createLandingEvent(eraseThreshold: number, setMessage: (message: string) => void, setPlayerScore: (score: (prevScore: number) => number) => void) {
    return ({ game, bodyA, bodyB }: any) => {
        let collisionX = (bodyA.translation().x + bodyB.translation().x) / 2;
        let collisionY = (bodyA.translation().y + bodyB.translation().y) / 2;
        playLandingSound();
        if (bodyA.translation().y > 0 && bodyB.translation().y > 0) {
            playDefeatSound();
            setMessage("게임오버");
            game.pause();
            return;
        }

        collisionParticleEffect(bodyA.translation().x, -bodyB.translation().y, game.graphics);
        collisionParticleEffect(bodyB.translation().x, -bodyB.translation().y, game.graphics);

        const checkResult = game.checkLine(eraseThreshold);
        const scoreList = checkResult.scoreList;

        let combo: number = 0;
        let scoreIncrement: number = 0;
        for (let i = 0; i < checkResult.scoreList.length; i++) {
            if (scoreList[i] >= eraseThreshold) {
                combo += 1;
                scoreIncrement += scoreList[i];
            }
        }


        if (game.removeLines(checkResult.lines)) {
            playExplodeSound();
            setPlayerScore((prevScore: number) => Math.round(prevScore + scoreIncrement * (1 + 0.1 * combo)));
            const comboMessage = handleComboEffect(combo, game.graphics);
            setMessage(comboMessage);
            setTimeout(() => {
                setMessage("");
            }, 1000);

            // @ts-ignore
            loadStarImage().then((starTexture: PIXI.Texture) => {
                starParticleEffect(0, 600, game.graphics, starTexture);
                starParticleEffect(450, 600, game.graphics, starTexture);
            }).catch((error: any) => {
                console.error(error);
            });
        }

        let nextBlock = BlockTypeList.at(randomInt(0, BlockTypeList.length + 1));
        game.spawnBlock(0xFF0000, nextBlock, true);
        fallingBlockGlow(game.fallingTetromino!);
    }
}
