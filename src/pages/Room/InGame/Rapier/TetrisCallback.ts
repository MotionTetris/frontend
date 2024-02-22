import { Socket } from "socket.io-client";
import { changeBlockGlow, createScoreBasedGrid, explodeRock, fallingBlockGlow, handleComboEffect, lightEffectToLine, performPushEffect, startShake } from "./Effect";
import { KeyPointCallback, KeyPoint } from "./PoseNet";
import { TetrisGame } from "./TetrisGame";
import { playBlockRotateSound, playDefeatSound, playExplodeSound, playLandingSound, playBombExplodeSound } from "./Sound/Sound";
import * as PIXI from "pixi.js";
import { BlockCollisionEvent, BlockSpawnEvent, ItemSpawnEvent, StepEvent } from "./TetrisEvent";
import { Palette } from "./Object/Tetromino";
import { clearBlock, drawBlock } from "../NextBlockViewer/NextBlock";
import { createBombBoundary } from "./Line";
import { Explosion } from "./Effect/Explosion";
import { playItemSpawnSound } from "./Object/ItemFactory";
import { eraseThreshold } from "./TetrisContants";

export function createUserEventCallback(game: TetrisGame, arrows: PIXI.Sprite[], socket?: Socket) {
    let nextColorIndex = 0;
    const eventCallback: KeyPointCallback = {
        onRotateLeft: function (_keypoints: Map<string, KeyPoint>): void {
            if (!game.isRunning) {
                const currentTab = document.activeElement;
                if (!currentTab) {
                    return
                }
                console.log("아이템 좌측이동");
                const tabIndex = parseInt(currentTab.getAttribute('tabIndex')!);
                const nextTab = document.querySelector('[tabIndex="' + (tabIndex + -1) + '"]');

                if (nextTab) {
                    (nextTab as HTMLElement).focus();
                }
                return;
            }
            playBlockRotateSound();
            nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
            const event = game.onRotateLeft();
            socket?.emit('eventOn', event);
        },
        onRotateRight: function (_keypoints: Map<string, KeyPoint>): void {
            if (!game.isRunning) {
                const currentTab = document.activeElement;
                if (!currentTab) {
                    return
                }
                console.log("아이템 우측이동");
                const tabIndex = parseInt(currentTab.getAttribute('tabIndex')!);
                const nextTab = document.querySelector('[tabIndex="' + (tabIndex + 1) + '"]');

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
            const centerX = keypoints.get("center")?.x;
            const nose = keypoints.get("nose");
            if (!nose || !centerX) {
                return;
            }
            const alpha = (nose.x - centerX) / 300;
            const forceMagnitude = Math.abs(nose.x - centerX) / (centerX);
            performPushEffect(arrows[0], arrows[1], alpha, 90, 660);
            const event = game.onMoveLeft(forceMagnitude);
            socket?.emit('eventOn', event);
        },
        onMoveRight: function (keypoints: Map<string, KeyPoint>): void {
            const centerX = keypoints.get("center")?.x;
            const nose = keypoints.get("nose");
            if (!nose || !centerX) {
                return;
            }
            const alpha = (nose.x - centerX) / 300;
            const forceMagnitude = Math.abs(nose.x - centerX) / (centerX);
            performPushEffect(arrows[1], arrows[0], alpha, 660, 90);
            const event = game.onMoveRight(forceMagnitude);
            socket?.emit('eventOn', event);
        }
    }
    return eventCallback;
}

export function createBlockSpawnEvent(socket?: Socket, app?: PIXI.Application, blockSize?: number, x?: number, y?: number) {
    if (!blockSize || !x || !y) {
        return;
    }
    const blocks = drawBlock(blockSize);
    return ({ game, blockType, blockColor, nextBlockType, nextBlockColor }: BlockSpawnEvent) => {
        const event = game.onBlockSpawned(blockType, blockColor, nextBlockType, nextBlockColor);
        if (app) {
            clearBlock(app);
            blocks(app, x, y, nextBlockType, nextBlockColor);
        }
        socket?.emit('eventOn', event);
    }
}

export function createItemSpawnEvent(socket?: Socket) {
    return ({ game, item }: ItemSpawnEvent) => {
        const event = game.onItemSpawned(item);
        socket?.emit('eventOn', event);
    }
}

export function createLandingEvent(eraseThreshold: number, lineGrids: PIXI.Graphics[], setMessage: (message: string) => void, setPlayerScore: (score: (prevScore: number) => number) => void, setIsCombine: (isCombine: boolean) => void, needSpawn: boolean, isMyGame: boolean, socket?: Socket) {
    return ({ game, bodyA, bodyB }: BlockCollisionEvent) => {
        playLandingSound();
        const typeA = bodyA.parent()?.userData.type;
        const typeB = bodyB.parent()?.userData.type;
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
            const ver = (typeA === 'rock') ? 0 : 1;
            explodeRock(game, bodyA, bodyB, ver);
            startShake({ viewport: game.graphics.viewport, strength: 50, duration: 400 + 50 });
            if (isMyGame) {
                setIsCombine(true);
                setTimeout(() => {
                    setIsCombine(false);
                }, 2500)
            }
        }

        if ((typeA === 'bomb' || typeB === 'bomb') &&
            typeA !== 'left_wall' && typeB !== 'left_wall' &&
            typeA !== 'right_wall' && typeB !== 'right_wall') {
            const find = (typeA === 'bomb') ? bodyA : bodyB;
            const translation = find.parent()?.translation();
            const boundary = createBombBoundary(translation.x, translation.y, 400, 400);
            game.removeLines([boundary]);
            setPlayerScore((prevScore) => prevScore + 30000);
            // @ts-ignore
            game.findById(find.parent()?.handle)?.remove();
            const explode = new Explosion(translation.x, translation.y, 4);
            explode.addTo(game.graphics.effectScene);
            explode.animate(0);
            playBombExplodeSound();
            startShake({ viewport: game.graphics.viewport, strength: 100, duration: 400 + 50 })
            if (isMyGame) {
                setIsCombine(true);
                setTimeout(() => {
                    setIsCombine(false);
                }, 2500)
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
            if (isMyGame) {
                setIsCombine(true);
                setTimeout(() => {
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
        const blockToSpawn = game.nextBlock;
        const blockColor = game.nextBlockColor;
        if (!blockToSpawn || !blockColor) {
            return;
        }
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

export const createCollisionEvent = (setPlayerScore: any) => ({ game, bodyA, bodyB }: any) => {
    const typeA = bodyA.parent()?.userData.type;
    const typeB = bodyB.parent()?.userData.type;

    if ((typeA === 'rock' || typeB === 'rock') &&
        typeA !== 'ground' && typeB !== 'ground' &&
        typeA !== 'left_wall' && typeB !== 'left_wall' &&
        typeA !== 'right_wall' && typeB !== 'right_wall') {
        const ver = (typeA === 'rock') ? 0 : 1;
        explodeRock(game, bodyA, bodyB, ver);
        setPlayerScore((prevScore: number) => prevScore + 10000);
    }

    if ((typeA === 'rock' || typeB === 'rock') && (typeA === 'ground') || (typeB === 'ground')) {
        const ver = (typeA === 'rock') ? bodyA.parent()?.handle : bodyB.parent()?.handle;
        game.findById(ver).remove();
    }
}

export const createStepEvent = (lineGrids: PIXI.Graphics[]) => ({game, currentStep}: StepEvent) => {
    if (currentStep % 15 === 0) {
        const checkResult = game.checkLine(eraseThreshold);
        createScoreBasedGrid(lineGrids, checkResult.scoreList, eraseThreshold);
    }
}