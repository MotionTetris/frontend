import RAPIER from "@dimforge/rapier2d";
import { BlockCollisionEvent } from "../TetrisEvent";
import * as PIXI from 'pixi.js';

export interface ITetrisObject {
    onCollision(event: BlockCollisionEvent): void;
    onLanding(event: BlockCollisionEvent): void;
    onPreLanding(event: BlockCollisionEvent): void;
    get rigidBody(): RAPIER.RigidBody;
    get graphics(): (PIXI.Graphics | PIXI.Sprite)[];
}