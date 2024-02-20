import RAPIER from "@dimforge/rapier2d";
import { TetrisGame } from "../TetrisGame";
import { TetrisOption } from "../TetrisOption";
import * as PIXI from 'pixi.js';
import { ITetrisObject } from "./TetrisObject";
import { BlockCollisionEvent } from "../TetrisEvent";
import { Tetromino } from "./Tetromino";
import { playBombExplodeSound } from "../Sound/Sound";
import { createExplosion, loadExplosionImage } from "../Effect";
import BombImage from '@assets/items/Bomb.png';
import { EffectLoader } from "../Effect/EffectLoader";
import { text } from "stream/consumers";

export class Bomb implements ITetrisObject {
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

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
        const rigidBody = this._world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.ball(40).setMass(1000000);
        this._world.createCollider(colliderDesc, rigidBody);
        this._rigidBody = rigidBody;

        let texture = EffectLoader.getTexture(BombImage)!;
        console.log(texture.width, texture.height);
        let graphic = game.graphics.addGraphics(texture, x, -y, rigidBody.collider(0), 160 / texture.width, 160 / texture.height);
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