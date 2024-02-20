import RAPIER from "@dimforge/rapier2d";
import { TetrisGame } from "../TetrisGame";
import { TetrisOption } from "../TetrisOption";
import * as PIXI from 'pixi.js';
import { ITetrisObject } from "./TetrisObject";
import { BlockCollisionEvent } from "../TetrisEvent";
import { EffectLoader } from "../Effect/EffectLoader";
import RockImage from '@assets/items/Stone.png';

export class Rock implements ITetrisObject {
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
        const x = option.spawnX ?? 0;
        const y = option.spawnY ?? 0;

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
        const rigidBody = this._world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(50, 50);
        this._world.createCollider(colliderDesc, rigidBody);
        this._rigidBody = rigidBody;
        const texture = EffectLoader.getTexture(RockImage)!;
        const graphic = game.graphics.addGraphics(texture, x, -y, rigidBody.collider(0), 160 / texture.width, 160 / texture.height);
        this._graphics.push(graphic);
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