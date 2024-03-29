import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import * as RAPIER from "@dimforge/rapier2d";
import { TetrisOption } from "./TetrisOption";
import { createRectangle } from "./Effect";
import { BlockColor, Palette } from "./Object/Tetromino";
let kk = 0;

export class Graphics {
    coll2gfx: Map<number, PIXI.DisplayObject>;
    colorIndex: number;
    renderer: PIXI.Renderer;
    scene: PIXI.Container;
    effectScene: PIXI.Container;
    viewport: Viewport;
    ticker: PIXI.Ticker;
    constructor(option: TetrisOption) {
        // High pixel Ratio make the rendering extremely slow, so we cap it.
        const pixelRatio = window.devicePixelRatio ? Math.min(window.devicePixelRatio, 1.5) : 1;

        this.coll2gfx = new Map();
        this.colorIndex = 0;
        this.renderer = new PIXI.Renderer({
            backgroundColor: 0x222929,
            backgroundAlpha: 0.1,
            antialias: true,
            resolution: pixelRatio,
            width: option.view.width,
            height: option.view.height,
            view: option.view
        });

        this.scene = new PIXI.Container();
        this.effectScene = new PIXI.Container();
        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: option.worldWidth,
            worldHeight: option.worldHeight,
            events: this.renderer.events
        });
        this.viewport.zIndex = 1;
        this.viewport.sortableChildren = true;
        this.effectScene.zIndex = 2;
        this.effectScene.sortableChildren = true;

        this.scene.addChild(this.viewport);
        this.viewport.addChild(this.effectScene);
        
        this.viewport.drag().pinch().wheel().decelerate();
        this.ticker = new PIXI.Ticker();
        
        function onContextMenu(event: UIEvent) {
            event.preventDefault();
        }

        document.oncontextmenu = onContextMenu;
        document.body.oncontextmenu = onContextMenu;
        this.viewport.setTransform(0, 180);
    }

    render(world: RAPIER.World) {
        kk += 1;
        this.updatePositions(world);
        this.renderer.render(this.scene);
    }

    lookAt(pos: {zoom: number; target: {x: number; y: number}}) {
        this.viewport.setZoom(pos.zoom);
        this.viewport.moveCenter(pos.target.x, pos.target.y);
    }

    updatePositions(world: RAPIER.World) {
        world.forEachCollider((elt) => {
            const gfx = this.coll2gfx.get(elt.handle);
            const translation = elt.translation();
            const rotation = elt.rotation();

            if (gfx) {
                gfx.position.x = translation.x;
                gfx.position.y = -translation.y;
                gfx.rotation = -rotation;
            }
        });
    }

    reset() {
        this.coll2gfx.forEach((gfx) => {
            this.viewport.removeChild(gfx);
            gfx.destroy();
        });
        this.coll2gfx = new Map();
        this.colorIndex = 0;
    }

    public addGraphics(texture: PIXI.Texture, x: number, y: number, collider?: RAPIER.Collider, scaleX?: number, scaleY?: number) {
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(scaleX, scaleY);
        sprite.x = x;
        sprite.y = -y;
        if (collider) {
            this.coll2gfx.set(collider.handle, sprite);
        }
        this.viewport.addChild(sprite);
        return sprite;
    }

    public removeGraphics(gfx: PIXI.Graphics | PIXI.Sprite) {
        this.viewport.removeChild(gfx);
    }

    public addCollider(collider: RAPIER.Collider, color: BlockColor, alpha: number = 1) {
        const parent = collider.parent();
        let graphics;
        let vertices;
        const instanceId = parent!.isFixed() ? 0 : this.colorIndex + 1;
        const colorPalette = Palette[color];
        switch (collider.shapeType()) {
            case RAPIER.ShapeType.Cuboid:
                const hext = collider.halfExtents();
                graphics = new PIXI.Graphics();
                graphics.beginFill(colorPalette[instanceId], alpha);
                graphics.drawRect(-1.0, 1.0, 2.0, -2.0);
                graphics.scale.x = hext.x;
                graphics.scale.y = hext.y;
                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.Ball:
                const rad = collider.radius();
                graphics = new PIXI.Graphics();
                graphics.beginFill(colorPalette[instanceId], alpha);
                graphics.drawCircle(-1.0, 1.0, 2.0);
                graphics.endFill();
                graphics.scale.x = rad;
                graphics.scale.y = rad;
                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.Polyline:
                vertices = Array.from(collider.vertices());
                graphics = new PIXI.Graphics();
                graphics
                    .lineStyle(0.2, colorPalette[instanceId])
                    .moveTo(vertices[0], -vertices[1]);

                for (let i = 2; i < vertices.length; i += 2) {
                    graphics.lineTo(vertices[i], -vertices[i + 1]);
                }

                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.HeightField:
                const heights = Array.from(collider.heightfieldHeights());
                const scale = collider.heightfieldScale();
                const step = scale.x / (heights.length - 1);

                graphics = new PIXI.Graphics();
                graphics
                    .lineStyle(0.2, colorPalette[instanceId])
                    .moveTo(-scale.x / 2.0, -heights[0] * scale.y);

                for (let i = 1; i < heights.length; i += 1) {
                    graphics.lineTo(
                        -scale.x / 2.0 + i * step,
                        -heights[i] * scale.y,
                    );
                }

                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.ConvexPolygon:
                vertices = Array.from(collider.vertices());
                graphics = new PIXI.Graphics();
                graphics.beginFill(colorPalette[instanceId], 1.0);
                graphics.moveTo(vertices[0], -vertices[1]);

                for (let i = 2; i < vertices.length; i += 2) {
                    graphics.lineTo(vertices[i], -vertices[i + 1]);
                }

                this.viewport.addChild(graphics);
                break;
            default:
                console.log("Unknown shape to render.");
                break;
        }

        if (!graphics) {
            console.error("Failed to create graphics");
            return;
        }

        const translation = collider.translation();
        const rotation = collider.rotation();
        graphics.position.x = translation.x;
        graphics.position.y = -translation.y;
        graphics.rotation = rotation;

        this.coll2gfx.set(collider.handle, graphics);
        this.colorIndex = (this.colorIndex + 1) % (colorPalette.length - 1);
        
        return graphics;
    }   
}