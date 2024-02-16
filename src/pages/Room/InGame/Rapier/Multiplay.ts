import { TetrisGame } from "./TetrisGame";

export class MultiplayEvent { 
    userId: string;
    event: PlayerEventType;
    stepId: number;
    sequence: number;
    userData: any;
    
    public constructor(userId: string, event: PlayerEventType, keyframe: number, sequence: number) {
        this.userId = userId;
        this.event = event;
        this.stepId = keyframe;
        this.sequence = sequence;
    }

    public static fromGame(game: TetrisGame, userId: string, event: PlayerEventType) {
        return new MultiplayEvent(userId, event, game.stepId, game.sequence);
    }
}

export enum PlayerEventType {
    MOVE_LEFT = 0,
    MOVE_RIGHT = 1,
    TURN_LEFT = 2,
    TURN_RIGHT = 3,
    BLOCK_SPAWNED = 4,
    ENGINE_PAUSE = 5,
    ENGINE_RESUME = 6,
    ITEM_USED = 7,
}

export class MultiPlayerContext {
    public userId: string;
    public lastSequence: number;
    public lastKeyframe: number;

    public constructor(userId: string) {
        this.userId = userId;
        this.lastSequence = 0;
        this.lastKeyframe = 0;
    }

    public isEventValid(event: MultiplayEvent) {
        if (this.lastSequence !== event.sequence - 1) {
            return false; 
        }

        if (this.lastKeyframe > event.stepId) {
            return false;
        }

        return true;
    }

    public updateNewEvent(event: MultiplayEvent) {
        this.lastSequence = event.sequence;
        this.lastKeyframe = event.stepId;
    }
}