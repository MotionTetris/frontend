import { TetrisOption } from "./TetrisOption";
import { MultiplayEvent, MultiPlayerContext, PlayerEventType } from "./Multiplay";
import { TetrisGame } from "./TetrisGame";
import { spawnBomb } from "./Item";
import RAPIER from "@dimforge/rapier2d";

export class TetrisMultiplayView extends TetrisGame {
    private multiPlayerContext?: MultiPlayerContext;
    private eventBuffer: Array<MultiplayEvent>;
    private isProcessingEvent: boolean;
    private bufferSizeForRenderStart: number;
    private bomb: any;

    public constructor(option: TetrisOption, userId: string, bufferSizeForRenderStart?: number) {
        super(option, userId);
        this.eventBuffer = [];
        this.isProcessingEvent = false;
        this.multiPlayerContext = new MultiPlayerContext(userId);
        this.bufferSizeForRenderStart = bufferSizeForRenderStart ?? 10;
    }

    public runKeyMultiplayEvent() {
        const cuurentSize = this.eventBuffer.length;
        if (!this.isProcessingEvent && cuurentSize > this.bufferSizeForRenderStart) {
            const recentEvent = this.eventBuffer.shift();
            if (!recentEvent) {
                return;
            }
            this.stepMultiplayEvent(recentEvent, recentEvent.sequence);
        }
    }

    public receiveMultiplayEvent(event: MultiplayEvent) {
        this.eventBuffer.push(event);
    }

    public stepMultiplayEvent(event: MultiplayEvent, seq: number) {
        if (!this.multiPlayerContext) {
            console.error("This is not multiplayer view.");
            return;
        }

        if (!this.world) {
            console.error("Failed to step. world is not set");
            return;
        }

        // TODO: World synchronization
        if (seq !== event.sequence) {
            return;
        }

        this.isProcessingEvent = true;
        if (event?.stepId > this.stepId) {
            this.step(this.world)
            requestAnimationFrame(() => this.stepMultiplayEvent(event, seq));
            return;
        }

        if (event?.stepId === this.stepId) {
            this.processEvent(event);
            this.isProcessingEvent = false;
            return;
        }

        /* CANNOT BE REACHED */ 
        if (event?.stepId < this.stepId) {
            throw new Error("Failed to synchronize");
        }
    }

    public run() {
        this.render();
    }

    private render() {
        if (!this.world) {
            console.error("Failed to render. world is not set");
            return;
        }

        this.graphics.render(this.world);
        this.runKeyMultiplayEvent();
        requestAnimationFrame(() => this.render());
    }

    private step(world: RAPIER.World) {
        this.emit("step", {game: this, currentStep: this.stepId});

        if (this.bomb && this.bomb.lifetime === this.stepId) {
            this.bomb.destroy();
            this.bomb = undefined;
        }

        world.step(this.events);
        this.stepId++;
        this.graphics.render(world);
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

    private processEvent(event: MultiplayEvent) {
        switch (event?.event) {
            case PlayerEventType.MOVE_LEFT:
                this.onMoveLeft(event.userData);
                break;
            case PlayerEventType.MOVE_RIGHT:
                this.onMoveRight(event?.userData);
                break;
            case PlayerEventType.TURN_LEFT:
                this.onRotateLeft();
                break;
            case PlayerEventType.TURN_RIGHT:
                this.onRotateRight();
                break;
            case PlayerEventType.BLOCK_SPAWNED:
                this.spawnBlock(event.userData.type, event.userData.blockColor);
                break;
            case PlayerEventType.ITEM_USED:
                spawnBomb(this, 300, -200).then((value) => {
                    this.bomb = value;
                });
                break;
                //폭탄떨구기.
            default:
                console.debug(`undefined evnet at ${this.stepId}, desired keyframe: ${event.stepId}`);
        }
    }
}