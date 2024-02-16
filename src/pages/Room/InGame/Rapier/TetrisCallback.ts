import { Socket } from "socket.io-client";
import { changeBlockGlow, collisionParticleEffect, fallingBlockGlow, handleComboEffect, lightEffectToLine, loadStarImage, performPushEffect } from "./Effect";
import { KeyPointCallback, KeyPoint } from "./PoseNet";
import { TetrisGame } from "./TetrisGame";
import { playBlockRotateSound, playDefeatSound, playExplodeSound, playLandingSound, playGameEndSound } from "./Sound";
import * as PIXI from "pixi.js";
import { BlockSpawnEvent } from "./TetrisEvent";
import { BlockColor, BlockType, Palette } from "./Tetromino";

export function createUserEventCallback(game: TetrisGame, socket?: Socket) {
    let nextColorIndex = 0;
    let eventCallback: KeyPointCallback = {
        onRotateLeft: function (_keypoints: Map<string, KeyPoint>): void {
            if (!game.isRunning) {
                var currentTab = document.activeElement;
                if (!currentTab) {
                    return
                }
                console.log("아이템 좌측이동");
                let tabIndex = parseInt(currentTab.getAttribute('tabIndex')!);
                let nextTab = document.querySelector('[tabIndex="' + (tabIndex + -1) + '"]');

                if (nextTab) {
                    (nextTab as HTMLElement).focus();
                }
                return;
            }
            playBlockRotateSound();
            nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
            let event = game.onRotateLeft();
            socket?.emit('eventOn', event);
        },
        onRotateRight: function (_keypoints: Map<string, KeyPoint>): void {
            if (!game.isRunning) {
                var currentTab = document.activeElement;
                if (!currentTab) {
                    return
                }
                console.log("아이템 우측이동");
                let tabIndex = parseInt(currentTab.getAttribute('tabIndex')!);
                let nextTab = document.querySelector('[tabIndex="' + (tabIndex + 1) + '"]');

                if (nextTab) {
                    (nextTab as HTMLElement).focus();
                }
                return;
            }
            playBlockRotateSound();
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
            performPushEffect(game.graphics.rectangles[0], game.graphics.rectangles[1], alpha, 60, 390);
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
            performPushEffect(game.graphics.rectangles[1], game.graphics.rectangles[0], alpha, 390, 60);
            const event = game.onMoveRight(forceMagnitude);
            socket?.emit('eventOn', event);
        }
    }
    return eventCallback;
}

export function createBlockSpawnEvent(socket?: Socket, setNextBlock?: any) {
    return ({game, blockType, blockColor, nextBlockType, nextBlockColor}: BlockSpawnEvent) => {
        let event = game.onBlockSpawned(blockType, blockColor, nextBlockType, nextBlockColor);
        setNextBlock(nextBlockType);
        socket?.emit('eventOn', event);   
    }
}

export function createLandingEvent(eraseThreshold: number, lineGrids: PIXI.Graphics[], setMessage: (message: string) => void, setPlayerScore: (score: (prevScore: number) => number) => void, needSpawn: boolean, isMyGame: boolean,socket?: Socket ) {
    return ({ game, bodyA, bodyB }: any) => {
        playLandingSound();

        if (bodyA.parent()?.userData.type == 'block' && bodyB.parent()?.userData.type == 'block' && bodyA.translation().y > 0 && bodyB.translation().y > 0) {
            //내 게임 오버
            if (isMyGame) {
                playDefeatSound();
                setMessage("나의 게임오버");
                socket?.emit('gameOver', true); //게임종료
                game.pause();
                return;
            }   
        }
        
        const checkResult = game.checkLine(eraseThreshold);
        const scoreList = checkResult.scoreList;

        let combo: number = 0;
        let scoreIncrement: number = 0;
        for (let i = 0; i < checkResult.scoreList.length; i++) {
            if (scoreList[i] >= eraseThreshold) {
                combo += 1;
                scoreIncrement += scoreList[i];
                lightEffectToLine(lineGrids, i);
            }
        }

        if (game.removeLines(checkResult.lines)) {
            playExplodeSound();
            setPlayerScore((prevScore: number) => Math.round(prevScore + scoreIncrement * (1 + 0.1 * combo)));
            if (isMyGame) {
                const comboMessage = handleComboEffect(combo, game.graphics);
                setMessage(comboMessage);
                setTimeout(() => {
                    setMessage("");
                }, 1000);
            }


        }
        let blockToSpawn: BlockType = game.nextBlock;
        let blockColor: BlockColor = game.nextBlockColor;
        if (needSpawn) {
            game.spawnBlock(blockToSpawn, blockColor);
            fallingBlockGlow(game.fallingTetromino!, Palette[blockColor][2]);
        }
    }
}