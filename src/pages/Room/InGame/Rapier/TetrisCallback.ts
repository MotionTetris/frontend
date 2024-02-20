import { Socket } from "socket.io-client";
import { changeBlockGlow, collisionParticleEffect, explodeBomb, fallingBlockGlow, handleComboEffect, lightEffectToLine, performPushEffect } from "./Effect";
import { KeyPointCallback, KeyPoint } from "./PoseNet";
import { TetrisGame } from "./TetrisGame";
import { playBlockRotateSound, playDefeatSound, playExplodeSound, playLandingSound, playGameEndSound, playBombExplodeSound } from "./Sound/Sound";
import * as PIXI from "pixi.js";
import { BlockSpawnEvent, ItemSpawnEvent } from "./TetrisEvent";
import { BlockColor, BlockType, Palette } from "./Object/Tetromino";
import { clearBlock, drawBlock } from "../NextBlockViewer/NextBlock";
import { NumberTuple } from "@tensorflow-models/posenet/dist/keypoints";
import { createBombBoundary } from "./Line";
import { Explosion } from "./Effect/Explosion";
import { Rock } from "./Object/Rock";
import { Bomb } from "./Object/Bomb";
import { ItemSpawnSoundMap, playItemSpawnSound } from "./Object/ItemFactory";

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

export function createBlockSpawnEvent(socket?: Socket, app?: PIXI.Application, blockSize?: number, x?: number, y?: number) {
    let blocks = drawBlock(blockSize);
    return ({ game, blockType, blockColor, nextBlockType, nextBlockColor }: BlockSpawnEvent) => {
        let event = game.onBlockSpawned(blockType, blockColor, nextBlockType, nextBlockColor);
        if (app) {
            clearBlock(app);
            blocks(app, x, y, nextBlockType, nextBlockColor);
        }
        socket?.emit('eventOn', event);
    }
}

export function createItemSpawnEvent(socket?: Socket) {
    return ({game, item}: ItemSpawnEvent) => {
        let event = game.onItemSpawned(item);
        socket?.emit('eventOn', event);
    }
}

export function createLandingEvent(eraseThreshold: number, lineGrids: PIXI.Graphics[], setMessage: (message: string) => void, setPlayerScore: (score: (prevScore: number) => number) => void, setIsCombine: (isCombine: boolean)=>void, needSpawn: boolean, isMyGame: boolean, socket?: Socket) {
    return ({ game, bodyA, bodyB }: any) => {
        playLandingSound();
        let typeA = bodyA.parent()?.userData.type;
        let typeB = bodyB.parent()?.userData.type;
        if (typeA == 'block' && typeB == 'block' && bodyA.translation().y > 0 && bodyB.translation().y > 0) {
            //내 게임 오버
            if (isMyGame) {
                playDefeatSound();
                setMessage("나의 게임오버");
                socket?.emit('gameOver', true); //게임종료
                game.pause();
                return;
            }
        }

        if ((typeA === 'rock' || typeB === 'rock') &&
            typeA !== 'ground' && typeB !== 'ground' &&
            typeA !== 'left_wall' && typeB !== 'left_wall' &&
            typeA !== 'right_wall' && typeB !== 'right_wall') {
            let ver = (typeA === 'rock') ? 0 : 1;
            explodeBomb(game, bodyA, bodyB, ver);
        }

        if ((typeA === 'bomb' || typeB === 'bomb') &&
            typeA !== 'left_wall' && typeB !== 'left_wall' &&
            typeA !== 'right_wall' && typeB !== 'right_wall') {
            let find = (typeA === 'bomb') ? bodyA : bodyB;
            let translation = find.parent()?.translation();
            let boundary = createBombBoundary(translation.x, translation.y, 400, 400);
            game.removeLines([boundary]);
            console.log(boundary);
            game.findById(find.parent()?.handle)?.remove();
            let explode = new Explosion(translation.x, translation.y, 4);
            explode.addTo(game.graphics.effectScene);
            explode.animate(0);
            playBombExplodeSound();
            console.log(translation);
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
            if(isMyGame) {
                setIsCombine(true);
                setTimeout(()=> {
                    setIsCombine(false);
                }, 2500)
            }
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
            if (game.nextItem) {
                playItemSpawnSound(game.nextItem)();
                game.spawnItem(game.nextItem);
                return;
            }
            game.spawnBlock(blockToSpawn, blockColor);
            fallingBlockGlow(game.fallingTetromino!, Palette[blockColor][2]);
        }
    }
}