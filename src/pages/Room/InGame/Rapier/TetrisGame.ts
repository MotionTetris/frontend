import {Graphics} from "./Graphics";
import * as RAPIER from "@dimforge/rapier2d";
import { BlockCollisionCallbackParam, TetrisOption } from "./TetrisOption";
import { BlockType, Tetromino } from "./Tetromino";
import { createLines } from "./Line";
import { calculateLineIntersectionArea } from "./BlockScore";
import { removeLines as removeShapeWithLine } from "./BlockRemove";
import { KeyFrameEvent, PlayerEventType } from "./Multiplay";
import { removeGlow } from "./Effect";
import { Bodies } from "matter-js";

type Line = number[][][]
export class TetrisGame {
    graphics: Graphics;
    inhibitLookAt: boolean;
    demoToken: number;
    events: RAPIER.EventQueue;
    world?: RAPIER.World;
    preTimestepAction?: (gfx: Graphics) => void;
    stepId: number;
    lastMessageTime?: number;
    snap?: Uint8Array;
    snapStepId?: number;
    option: TetrisOption;
    tetrominos: Set<Tetromino>;
    fallingTetromino?: Tetromino;
    lines: Line[];
    sequence: number;
    userId: string;
    running: boolean;
    private removeBodies: Array<RAPIER.RigidBody>;

    private readonly defaultWallColor = 0x222929
    public constructor(option: TetrisOption, userId: string) {
        if (!option.view) {
            throw new Error("Canvas is null");
        }

        this.graphics = new Graphics(option);
        this.inhibitLookAt = false;
        this.demoToken = 0;
        this.events = new RAPIER.EventQueue(true);
        this.option = option;
        this.tetrominos = new Set();
        this.lines = createLines(-20 * option.blockSize + 20, 0, option.blockSize);
        this.sequence = 0;
        this.running = false;
        this.userId = userId;
        this.stepId = 0;
        this.removeBodies = [];
    }

    public set landingCallback(callback: ((result: BlockCollisionCallbackParam) => void)) {
        this.option.blockLandingCallback = callback;
    }

    public setpreTimestepAction(action: (gfx: Graphics) => void) {
        this.preTimestepAction = action;
    }

    public dispose() {
        this.world?.free();
    }

    public addRigidBodyToRemoveQueue(body: RAPIER.RigidBody) {
        this.removeBodies.push(body);
    }

    public setWorld(world: RAPIER.World) {
        document.onkeyup = null;
        document.onkeydown = null;
        this.preTimestepAction = undefined;
        this.world = world;
        this.world.numSolverIterations = 4;
        this.demoToken += 1;
        this.stepId = 0;

        world.forEachCollider((coll) => {
            // @ts-ignore
            if (coll.parent() && coll.parent()?.userData.color) {
                // @ts-ignore
                this.graphics.addCollider(coll, coll.parent()?.userData.color, coll.parent()?.userData.alpha);
                return;
            }
            this.graphics.addCollider(coll);
        });
        this.graphics.render(this.world);
        this.lastMessageTime = new Date().getTime();
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
    }

    public restoreSnapshot() {
        if (!!this.snap && this.snapStepId && this.world) {
            this.world.free();
            this.world = RAPIER.World.restoreSnapshot(this.snap);
            this.stepId = this.snapStepId;
            this.tetrominos.clear();
            
            this.world.bodies.forEach((value) => {
                // @ts-ignore
                if (value.userData && value.userData.type && value.userData.type === 'block') {
                    // @ts-ignore
                    this.tetrominos.push(this.spawnFromRigidBody(value.userData.color, value));
                }
            });
        }
    }

    protected updateSequence() {
        this.sequence += 1;
    }

    public run() {
        if (!this.world) {
            console.error("Failed to run. world is not set");
            return;
        }

        if (!this.running) {
            return;
        }

        if (this.preTimestepAction) {
            this.preTimestepAction(this.graphics);
        }

        if (this.option.stepCallback) {
            this.option.stepCallback(this, this.stepId);
        }

        this.world.step(this.events);
        this.stepId += 1;
        this.graphics.render(this.world);
        this.events.drainCollisionEvents((handle1: number, handle2: number, started: boolean) => {
            if (!started) {
                return;
            }

            if (!this.world) {
                console.error("Failed to run. world is not set");
                return;
            }

            const body1 = this.world.getCollider(handle1);
            const body2 = this.world.getCollider(handle2);
            this.onCollisionDetected(body1, body2);
        });
        
        for (let body of this.removeBodies) {
            console.log(this.removeBodies);
            this.world.removeRigidBody(body);
        }
        this.removeBodies = [];
        requestAnimationFrame(() => this.run());
    }

    public pause() {
        this.running = false;
    }

    public resume() {
        this.running = true;
        requestAnimationFrame(() => this.run());
    }

    public removeBlock(block: Tetromino) {
        block.remove();
        this.tetrominos.delete(block);
    }

    /* Spawn new block */
    public spawnBlock(color: number, blockType: BlockType, spawnedForFalling?: boolean) {
        if (!this.world) {
            throw new Error("Failed to spawn block. world is not set");
        }

        const newBody = new Tetromino(this, this.option, this.world, this.graphics.viewport, undefined, color, blockType);
        for (let i = 0; i < newBody.rigidBody.numColliders(); i++) {
            const graphics = this.graphics.addCollider(newBody.rigidBody.collider(i));
            if (graphics) {
                newBody.addGraphics(graphics);
            }

            newBody.rigidBody.collider(i).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }

        newBody.rigidBody.userData = {
            color: color,
            type: 'block'
        };

        newBody.rigidBody.setLinearDamping(0.25);
        newBody.rigidBody.setAngularDamping(10);
        if (spawnedForFalling) {
            this.fallingTetromino = newBody;
            return newBody;
        }
        this.tetrominos.add(newBody);
        return newBody;
    }

    public spawnFromRigidBody(color: number, rigidBody: RAPIER.RigidBody) {
        if (!this.world) {
            throw new Error("Failed to spawn block. world is not set");
        }

        const tetromino = new Tetromino(this, this.option, this.world, this.graphics.viewport, rigidBody, color);
        for (let i = 0; i < rigidBody.numColliders(); i++) {
            rigidBody.collider(i).setRestitution(0);
            rigidBody.collider(i).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }
        this.tetrominos.add(tetromino);
        return tetromino; 
    }

    /* Spawn rigid body */
    public spawnFromRigidBodyDesc(color: number, rigidBodyDesc: RAPIER.RigidBodyDesc) {
        if (!this.world) {
            throw new Error("Failed to spawn block. world is not set");
        }

        const newBody = this.world.createRigidBody(rigidBodyDesc);
        const tetromino = new Tetromino(this, this.option, this.world, this.graphics.viewport, newBody, color);
        for (let i = 0; i < tetromino.rigidBody.numColliders(); i++) {
            this.graphics.addCollider(tetromino.rigidBody.collider(i));
            tetromino.rigidBody.collider(i).setRestitution(0);
            tetromino.rigidBody.collider(i).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }

        rigidBodyDesc.userData = {
            color: color,
            type: 'block'
        };

        this.tetrominos.add(tetromino);
        return tetromino;
    }

    public spawnFromColliderDescs(color: number, coliderDescs: RAPIER.ColliderDesc[][]) {
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
                this.world.createCollider(collider, body);
            }

            const shape = new Tetromino(this, this.option, this.world, this.graphics.viewport, body, color);
            shapes.push(shape);
        }

        for (const shape of shapes) {
            for (let i = 0; i < shape.rigidBody.numColliders(); i++) {
                const graphics = this.graphics.addCollider(shape.rigidBody.collider(i));
                if (graphics) {
                    shape.addGraphics(graphics);
                }
            }
            this.tetrominos.add(shape);
            console.log(shape.rigidBody.translation());
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
            shapes.forEach((value) => {
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
        this.fallingTetromino?.rigidBody.setAngvel(10, false);
        const event = KeyFrameEvent.fromGame(this, this.userId, PlayerEventType.TURN_LEFT);
        this.updateSequence();
        return event;
    }

    public onRotateRight() {
        this.fallingTetromino?.rigidBody.setAngvel(-10, false);
        const event =  KeyFrameEvent.fromGame(this, this.userId, PlayerEventType.TURN_RIGHT);
        this.updateSequence();
        return event;
    }

    public onMoveLeft(weight: number) {
        let velocity = this.fallingTetromino?.rigidBody.linvel()!;
        this.fallingTetromino?.rigidBody.setLinvel({x: -weight * 100, y: velocity.y}, false);
        const event = KeyFrameEvent.fromGame(this, this.userId, PlayerEventType.MOVE_LEFT);
        event.userData = weight;
        this.updateSequence();
        return event;
    }

    public onMoveRight(weight: number) {
        let velocity = this.fallingTetromino?.rigidBody.linvel()!;
        this.fallingTetromino?.rigidBody.setLinvel({x: weight * 100, y: velocity.y}, false);
        const event = KeyFrameEvent.fromGame(this, this.userId, PlayerEventType.MOVE_RIGHT);
        event.userData = weight;
        this.updateSequence();
        return event;
    }

    public onBlockSpawned(type: BlockType) {
        const event = KeyFrameEvent.fromGame(this, this.userId, PlayerEventType.BLOCK_SPAWNED);
        event.userData = type;
        this.sequence += 1;
        return event;
    }

    protected onCollisionDetected(collider1: RAPIER.Collider, collider2: RAPIER.Collider) {
        const body1 = collider1.parent();
        const body2 = collider2.parent();
        if (!body1 || !body2) {
            return;
        }

        if (this.isFalling(body1, body2) && !this.collideWithWall(body1, body2)) {
            this.tetrominos.add(this.fallingTetromino!);
            if (this.option.preBlockLandingCallback) {
                try {
                    this.option.preBlockLandingCallback({game: this, bodyA: collider1, bodyB: collider2});
                } catch (error) {
                    console.log(error);
                }
            }
            
            this.fallingTetromino = undefined;
            if (this.option.blockLandingCallback) {
                this.option.blockLandingCallback({game: this, bodyA: collider1, bodyB: collider2});
            }
            
            return;
        }

        if (this.option.blockCollisionCallback) {
            this.option.blockCollisionCallback({game: this, bodyA: collider1, bodyB: collider2});
        }
    }

    protected isFalling(body1: RAPIER.RigidBody, body2: RAPIER.RigidBody) {
        const fallingBody = this.fallingTetromino?.rigidBody?.handle;
        return this.fallingTetromino && (fallingBody === body1.handle || fallingBody === body2.handle)
    }

    protected collideWithWall(body1: RAPIER.RigidBody, body2: RAPIER.RigidBody) {
        // @ts-ignore
        return (body1.userData?.type === "left_wall" || body1.userData?.type === "right_wall") || (body2.userData?.type === "left_wall" || body2.userData?.type === "right_wall")
    }
}