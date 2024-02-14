import { Socket } from "socket.io-client";
import { changeBlockGlow, collisionParticleEffect, fallingBlockGlow, handleComboEffect, lightEffectToLine, loadStarImage, performPushEffect, starParticleEffect } from "./Effect";
import { KeyPointCallback, KeyPoint } from "./PostNet";
import { TetrisGame } from "./TetrisGame";
import { playBlockRotateSound, playDefeatSound, playExplodeSound, playLandingSound, playGameEndSound, stopIngameSound } from "./Sound";
import * as PIXI from "pixi.js";
import { BlockType, BlockTypeList } from "./Tetromino";
import { showGameOverModal } from "./Effect";

export function createUserEventCallback(game: TetrisGame, socket?: Socket) {
    let nextColorIndex = 0;
    let eventCallback: KeyPointCallback = {
        onRotateLeft: function (keypoints: Map<string, KeyPoint>): void {
            if (game.running === false) {
                var currentTab = document.activeElement;
                if (!currentTab) {
                    return
                }
                console.log("아이템 좌측이동");
                let tabIndex = parseInt(currentTab.getAttribute('tabIndex')!);
                let nextTab = document.querySelector('[tabIndex="' + (tabIndex + -1) + '"]');

                if (nextTab) {
                    nextTab.focus();
                }
                return;
            }
            playBlockRotateSound();
            nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
            let event = game.onRotateLeft();
            socket?.emit('eventOn', event);
        },
        onRotateRight: function (keypoints: Map<string, KeyPoint>): void {
            if (game.running === false) {
                var currentTab = document.activeElement;
                if (!currentTab) {
                    return
                }
                console.log("아이템 우측이동");
                let tabIndex = parseInt(currentTab.getAttribute('tabIndex')!);
                let nextTab = document.querySelector('[tabIndex="' + (tabIndex + 1) + '"]');

                if (nextTab) {
                    nextTab.focus();
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

export function createBlockSpawnEvent(socket?: Socket, setNextBlock?: any) {
    return (game: TetrisGame, blockType: BlockType, blockColor: number, nextBlockType: BlockType, nextBlockColor: number) => {
        let event = game.onBlockSpawned(blockType, blockColor, nextBlockType, nextBlockColor);
        event.userData = blockType;
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

            // @ts-ignore
            loadStarImage().then((starTexture: PIXI.Texture) => {
                starParticleEffect(0, 600, game.graphics, starTexture);
                starParticleEffect(450, 600, game.graphics, starTexture);
            }).catch((error: any) => {
                console.error(error);
            });
        }
        let blockToSpawn = game.nextBlock;
        
        if (needSpawn) {
            game.spawnBlock(0xFF0000, blockToSpawn, true);
            fallingBlockGlow(game.fallingTetromino!);
        }
    }
}