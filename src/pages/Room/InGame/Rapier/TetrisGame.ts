import { Graphics } from "./Graphics";
import * as RAPIER from "@dimforge/rapier2d";
import { TetrisOption } from "./TetrisOption";
import { BlockColor, BlockColorList, BlockType, BlockTypeList, Tetromino } from "./Tetromino";
import { Line, createLines } from "./Line";
import { calculateLineIntersectionArea } from "./BlockScore";
import { removeLines as removeShapeWithLine } from "./BlockRemove";
import { MultiplayEvent, PlayerEventType } from "./Multiplay";
import { Wall } from "./Wall";
import { EventEmitter } from 'events'
import { getRandomInt } from "@src/util/random";
import { MAX_FRAMERATE, MAX_HEIGHT, WallType } from "./TetrisContants";
import { TetrisEventMap } from "./TetrisEvent";

export class TetrisGame {
    graphics: Graphics;
    inhibitLookAt: boolean;
    events: RAPIER.EventQueue;
    world?: RAPIER.World;
    preTimestepAction?: (gfx: Graphics) => void;
    stepId: number;
    snap?: Uint8Array;
    snapStepId?: number;
    option: TetrisOption;
    tetrominos: Map<number, Tetromino>;
    snapTetrominos?: Map<number, Tetromino>;
    fallingTetromino?: Tetromino;
    lines: Line[];
    userId: string;
    protected _sequence: number;
    protected _isRunning: boolean;
    protected _lastRenderingTime: number;
    protected _nextBlock?: BlockType;
    protected _nextBlockColor?: BlockColor;
    private _removeBodies: Array<RAPIER.RigidBody>;
    private _walls: Map<number, Wall>
    private _event: EventEmitter;
    private _latestRequestFrameId?: number;

    public constructor(option: TetrisOption, userId: string) {
        if (!option.view) {
            throw new Error("Canvas is null");
        }

        this.graphics = new Graphics(option);
        this.inhibitLookAt = false;
        this.events = new RAPIER.EventQueue(true);
        this.option = option;
        this.tetrominos = new Map();
        this.lines = createLines(-MAX_HEIGHT * option.blockSize + 20, 0, option.blockSize);
        this._sequence = 0;
        this._isRunning = false;
        this.userId = userId;
        this.stepId = 0;
        this._removeBodies = [];
        this._walls = new Map();
        this._lastRenderingTime = 0;
        this._nextBlock = BlockTypeList.at(getRandomInt(0, BlockTypeList.length - 1));

        // @ts-ignore
        // TODO: Find a more elegant way to do this.
        this._nextBlockColor = BlockColorList.at(getRandomInt(0, BlockColorList.length - 1));
        this._event = new EventEmitter();
    }

    public setpreTimestepAction(action: (gfx: Graphics) => void) {
        this.preTimestepAction = action;
    }

    public dispose() {
        this.world?.free();
        this._event.removeAllListeners();
    }

    public addRigidBodyToRemoveQueue(body: RAPIER.RigidBody) {
        this._removeBodies.push(body);
    }

    public getTetrominoFromHandle(handle: number) {
        return this.tetrominos.get(handle);
    }

    public setWorld(world: RAPIER.World) {
        document.onkeyup = null;
        document.onkeydown = null;
        this.preTimestepAction = undefined;
        this.world = world;
        this.world.numSolverIterations = 4;
        this.stepId = 0;
        this._walls = new Map();

        world.forEachCollider((coll) => {
            // @ts-ignore
            if (coll.parent() && coll.parent()?.userData.color) {
                // @ts-ignore
                this.graphics.addCollider(coll, coll.parent()?.userData.color, coll.parent()?.userData.alpha);
                return;
            }
            this.graphics.addCollider(coll, "blue");
        });

        world.forEachRigidBody((body) => {
            let wall = new Wall(body);
            wall.userData = body.userData;
            this._walls.set(wall.rigidBody.handle, wall);
        });

        this.graphics.render(this.world);
    }

    public lookAt(pos: Parameters<Graphics["lookAt"]>[0]) {
        if (!this.inhibitLookAt) {
            this.graphics.lookAt(pos);
        }

        this.inhibitLookAt = false;
    }

    public takeSnapshot() {
        if (!this.world) {
            console.error("Failed to take snapshot: world is not set");
            return;
        }

        this.snap = this.world.takeSnapshot();
        this.snapStepId = this.stepId;
        this.snapTetrominos = new Map(this.tetrominos);
    }

    public restoreSnapshot() {
        if (!!this.snap && this.snapStepId && this.world) {
            this.world.free();
            this.world = RAPIER.World.restoreSnapshot(this.snap);
            this.stepId = this.snapStepId;
            this.tetrominos = new Map(this.snapTetrominos);
        }
    }

    protected updateSequence() {
        this._sequence += 1;
    }

    public get sequence() {
        return this._sequence;
    }

    public run(time?: number) {
        time ??= 0;
        let dt = time - this._lastRenderingTime;

        if (!this.world) {
            console.error("Failed to run. world is not set");
            return;
        }

        if (!this._isRunning) {
            return;
        }

        if (dt < 1000 / MAX_FRAMERATE) {
            this._latestRequestFrameId = requestAnimationFrame((time) => this.run(time));
            return;
        }

        this._lastRenderingTime = time;
        if (this.preTimestepAction) {
            this.preTimestepAction(this.graphics);
        }

        this.emit("step", { game: this, currentStep: this.stepId });

        this.updateWorld(this.world);
        this.graphics.render(this.world);
        this._latestRequestFrameId = requestAnimationFrame((time) => this.run(time));
    }

    public updateWorld(world: RAPIER.World) {
        world.step(this.events);
        this.stepId += 1;
        this.events.drainCollisionEvents((handle1: number, handle2: number, started: boolean) => {
            if (!started) {
                return;
            }

            const body1 = world.getCollider(handle1);
            const body2 = world.getCollider(handle2);
            this.onCollisionDetected(body1, body2);
        });

        this.emptyRemoveQueue();
    }

    public pause() {
        this._isRunning = false;
        if (this._latestRequestFrameId) {
            cancelAnimationFrame(this._latestRequestFrameId);
            this._latestRequestFrameId = undefined;
        }
        this.emit("pause", { game: this });
    }

    public resume() {
        if (!this.isRunning) {
            this._isRunning = true;
            this.emit("resume", { game: this });
            this._latestRequestFrameId = requestAnimationFrame((time) => this.run(time));
        }
    }

    public get isRunning() {
        return this._isRunning;
    }

    public get nextBlock() {
        return this._nextBlock;
    }

    public get nextBlockColor() {
        return this._nextBlockColor;
    }

    protected emptyRemoveQueue() {
        if (!this.world) {
            return;
        }

        for (let body of this._removeBodies) {
            this.world.removeRigidBody(body);
        }
        this._removeBodies = [];
    }

    public removeBlock(block: Tetromino) {
        block.remove();
        this.tetrominos.delete(block.rigidBody.handle);
    }

    /* Spawn new block */
    public spawnBlock(blockType: BlockType, color: BlockColor, alpha: number = 1, spawnedForFalling: boolean = true) {
        if (!this.world) {
            throw new Error("Failed to spawn block. world is not set");
        }

        const newBody = new Tetromino(this, this.option, this.world, this.graphics.viewport, undefined, color, alpha, blockType);
        for (let i = 0; i < newBody.rigidBody.numColliders(); i++) {
            const graphics = this.graphics.addCollider(newBody.rigidBody.collider(i), color, 1);
            if (graphics) {
                newBody.addGraphics(graphics);
            }

            newBody.rigidBody.collider(i).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
            newBody.rigidBody.collider(i).setRestitution(0);
        }

        newBody.userData = {
            color: color,
            type: 'block'
        };

        newBody.rigidBody.userData = {
            color: color,
            type: 'block'
        }

        newBody.rigidBody.setLinearDamping(0.25);
        newBody.rigidBody.setAngularDamping(10);

        if (!spawnedForFalling) {
            this.tetrominos.set(newBody.rigidBody.handle, newBody);
        } else {
            this.fallingTetromino = newBody;
            this._nextBlock = BlockTypeList.at(getRandomInt(0, BlockTypeList.length - 1));
            // @ts-ignore
            // TODO: Find a more elegant way to do this.
            this._nextBlockColor = BlockColorList.at(getRandomInt(0, BlockColorList.length - 1));
        }

        this.emit("blockSpawn", { game: this, blockType: blockType, blockColor: color, nextBlockType: this._nextBlock!, nextBlockColor: this.nextBlockColor! });
        return newBody;
    }

    public spawnFromRigidBody(color: BlockColor, rigidBody: RAPIER.RigidBody) {
        if (!this.world) {
            throw new Error("Failed to spawn block. world is not set");
        }

        const tetromino = new Tetromino(this, this.option, this.world, this.graphics.viewport, rigidBody, color);
        for (let i = 0; i < rigidBody.numColliders(); i++) {
            rigidBody.collider(i).setRestitution(0);
            rigidBody.collider(i).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }
        this.tetrominos.set(tetromino.rigidBody.handle, tetromino);
        return tetromino;
    }

    /* Spawn rigid body */
    public spawnFromRigidBodyDesc(color: BlockColor, rigidBodyDesc: RAPIER.RigidBodyDesc) {
        if (!this.world) {
            throw new Error("Failed to spawn block. world is not set");
        }

        const newBody = this.world.createRigidBody(rigidBodyDesc);
        const tetromino = new Tetromino(this, this.option, this.world, this.graphics.viewport, newBody, color);
        for (let i = 0; i < tetromino.rigidBody.numColliders(); i++) {
            this.graphics.addCollider(tetromino.rigidBody.collider(i), "brown");
            tetromino.rigidBody.collider(i).setRestitution(0);
            tetromino.rigidBody.collider(i).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }

        rigidBodyDesc.userData = {
            color: color,
            type: 'block'
        };

        this.tetrominos.set(tetromino.rigidBody.handle, tetromino);
        return tetromino;
    }

    public spawnFromColliderDescs(color: BlockColor, coliderDescs: RAPIER.ColliderDesc[][]) {
        if (!this.world) {
            throw new Error("Failed to spawn block. world is not set");
        }

        const shapes = [];
        for (const coliderDesc of coliderDescs) {
            const bodyDesc = RAPIER.RigidBodyDesc.dynamic();
            const body = this.world.createRigidBody(bodyDesc);
            body.userData = {
                color: color,
                type: 'block'
            };

            for (const collider of coliderDesc) {
                collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
                collider.setRestitution(0);
                this.world.createCollider(collider, body);
            }

            const shape = new Tetromino(this, this.option, this.world, this.graphics.viewport, body, color);
            shapes.push(shape);
        }

        for (const shape of shapes) {
            for (let i = 0; i < shape.rigidBody.numColliders(); i++) {
                const graphics = this.graphics.addCollider(shape.rigidBody.collider(i), shape.fillStyle);
                if (graphics) {
                    shape.addGraphics(graphics);
                }
            }
            this.tetrominos.set(shape.rigidBody.handle, shape);
        }

        return shapes;
    }

    public checkLine(threshold: number) {
        let scoreSum = 0;
        const lineToRemove: Line[] = [];
        const lineIndices: number[] = [];
        const scoreList: number[] = [];
        for (let i = 0; i < this.lines.length; i++) {
            let score = 0;
            this.tetrominos.forEach((value) => {
                score += calculateLineIntersectionArea(value.rigidBody, this.lines[i]);
            });

            if (score >= threshold) {
                scoreSum += score;
                lineToRemove.push(this.lines[i]);
                lineIndices.push(i);
            }

            scoreList.push(score);
        }

        return {
            lines: lineToRemove,
            area: scoreSum,
            lineIndices: lineIndices,
            scoreList: scoreList
        }
    }

    /* If nothing can be removed, it returns false. otherwise returns true. */
    public removeLines(lineToRemove: Line[]) {
        if (lineToRemove.length === 0) {
            return false;
        }

        // TODO: Shape-cast and remove without removing and re-create all shapes in the world
        for (const line of lineToRemove) {
            const shapes = [...this.tetrominos];
            shapes.forEach(([_, value]) => {
                const result = removeShapeWithLine(value.rigidBody, line);
                const color = value.fillStyle;
                this.removeBlock(value);
                if (!result) {
                    return;
                }
                this.spawnFromColliderDescs(color, result);
            });
        }

        return true;
    }

    public onRotateLeft() {
        this.fallingTetromino?.rigidBody.setAngvel(14, false);
        const event = MultiplayEvent.fromGame(this, this.userId, PlayerEventType.TURN_LEFT);
        this.updateSequence();
        return event;
    }

    public onRotateRight() {
        this.fallingTetromino?.rigidBody.setAngvel(-14, false);
        const event = MultiplayEvent.fromGame(this, this.userId, PlayerEventType.TURN_RIGHT);
        this.updateSequence();
        return event;
    }

    public onMoveLeft(weight: number) {
        let velocity = this.fallingTetromino?.rigidBody.linvel()!;
        this.fallingTetromino?.rigidBody.setLinvel({ x: -weight * 100, y: velocity.y }, false);
        const event = MultiplayEvent.fromGame(this, this.userId, PlayerEventType.MOVE_LEFT);
        event.userData = weight;
        this.updateSequence();
        return event;
    }

    public onMoveRight(weight: number) {
        let velocity = this.fallingTetromino?.rigidBody.linvel()!;
        this.fallingTetromino?.rigidBody.setLinvel({ x: weight * 100, y: velocity.y }, false);
        const event = MultiplayEvent.fromGame(this, this.userId, PlayerEventType.MOVE_RIGHT);
        event.userData = weight;
        this.updateSequence();
        return event;
    }

    public onBlockSpawned(type: BlockType, blockColor: BlockColor, nextBlockType: BlockType, nextBlockColor: BlockColor) {
        const event = MultiplayEvent.fromGame(this, this.userId, PlayerEventType.BLOCK_SPAWNED);
        event.userData = { type, blockColor, nextBlockType, nextBlockColor };
        this._sequence += 1;
        return event;
    }

    protected onCollisionDetected(collider1: RAPIER.Collider, collider2: RAPIER.Collider) {
        const body1 = collider1.parent();
        const body2 = collider2.parent();
        if (!body1 || !body2) {
            return;
        }

        if (this.isFalling(body1, body2) && !this.collideWithWall(body1, body2)) {
            this.tetrominos.set(this.fallingTetromino!.rigidBody.handle, this.fallingTetromino!);
            this.emit("prelanding", { game: this, bodyA: collider1, bodyB: collider2 });
            this.fallingTetromino = undefined;
            this.emit("landing", { game: this, bodyA: collider1, bodyB: collider2 });
            return;
        }

        this.emit("collision", { game: this, bodyA: collider1, bodyB: collider2 });
    }

    private isFalling(body1: RAPIER.RigidBody, body2: RAPIER.RigidBody) {
        const fallingBody = this.fallingTetromino?.rigidBody?.handle;
        return this.fallingTetromino && (fallingBody === body1.handle || fallingBody === body2.handle)
    }

    private collideWithWall(body1: RAPIER.RigidBody, body2: RAPIER.RigidBody) {
        let userData1 = this._walls.get(body1.handle)?.userData;
        let userData2 = this._walls.get(body2.handle)?.userData;
        return (userData1?.type === WallType.LEFT_WALL || userData1?.type === WallType.RIGHT_WALL) ||
            (userData2?.type === WallType.LEFT_WALL || userData2?.type === WallType.RIGHT_WALL);
    }

    public on<K extends keyof TetrisEventMap>(eventName: K, listener: (event: TetrisEventMap[K]) => any) {
        return this._event.on(eventName, listener);
    }

    public off<K extends keyof TetrisEventMap>(eventName: K, listener: (event: TetrisEventMap[K]) => any) {
        return this._event.off(eventName, listener);
    }

    public once<K extends keyof TetrisEventMap>(eventName: K, listener: (event: TetrisEventMap[K]) => any) {
        return this._event.once(eventName, listener);
    }

    protected emit<K extends keyof TetrisEventMap>(eventName: K, arg: TetrisEventMap[K]) {
        return this._event.emit(eventName, arg);
    }
}