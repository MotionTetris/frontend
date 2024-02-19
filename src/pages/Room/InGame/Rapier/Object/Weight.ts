import RAPIER from "@dimforge/rapier2d";
import { TetrisGame } from "../TetrisGame";
import { TetrisOption } from "../TetrisOption";
import * as PIXI from 'pixi.js';
import { ITetrisObject } from "./TetrisObject";
import { BlockCollisionEvent } from "../TetrisEvent";

export class Weight implements ITetrisObject {
    private _rigidBody: RAPIER.RigidBody;
    private _graphics: (PIXI.Graphics | PIXI.Sprite)[];
    private _context: PIXI.Container;
    private _game: TetrisGame;
    private _world: RAPIER.World;
    userData?: any;

    public constructor(game: TetrisGame, option: TetrisOption, world: RAPIER.World, ctx: PIXI.Container, width: number, height: number) {
        this._game = game;
        this._world = world;
        this._context = ctx;
        this._graphics = [];
        let x = option.spawnX ?? 0;
        let y = option.spawnY ?? 0;
        let x1 = width / 2 * 0.7;
        let y1 = height / 2;
        let x2 = -width / 2 * 0.7;
        let y2 = height / 2;
        let x3 = (-width / 2);
        let y3 = -height / 2;
        let x4 = (width / 2);
        let y4 = -height / 2;

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
        const rigidBody = this._world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.convexHull(new Float32Array([x1, y1, x2, y2, x3, y3, x4, y4]))!.setMass(1000000);
        this._world.createCollider(colliderDesc, rigidBody);
        this._rigidBody = rigidBody;
    }

    public onCollision(event: BlockCollisionEvent): void {
        return;
    }

    public onLanding(event: BlockCollisionEvent): void {
        return;
    }
    
    public onPreLanding(event: BlockCollisionEvent): void {
        return;
    }

    public get graphics() {
        return this._graphics;
    }

    public addGraphics(graphics: PIXI.Graphics | PIXI.Sprite) {
        this._graphics.push(graphics);
    }

    public get rigidBody() {
        return this._rigidBody;
    }

    public remove() {
        this._graphics.forEach((value) => {
            this._context.removeChild(value);
        });
        this._rigidBody.setTranslation({x: 10000, y: 0}, false);
        this._game.addRigidBodyToRemoveQueue(this._rigidBody);
    }
}