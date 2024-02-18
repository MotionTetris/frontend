import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import * as RAPIER from "@dimforge/rapier2d";
import { TetrisOption } from "./TetrisOption";
import { createRectangle } from "./Effect";
import { BlockColor, Palette } from "./Tetromino";
const BOX_INSTANCE_INDEX = 0;
const BALL_INSTANCE_INDEX = 1;

let kk = 0;

export class Graphics {
    coll2gfx: Map<number, PIXI.Graphics>;
    colorIndex: number;
    renderer: PIXI.Renderer;
    scene: PIXI.Container; 
    viewport: Viewport;
    rectangles: Array<PIXI.Sprite>;
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
        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: option.worldWidth,
            worldHeight: option.worldHeight,
            events: this.renderer.events
        });

        this.scene.addChild(this.viewport);
    
        this.viewport.drag().pinch().wheel().decelerate();
        this.rectangles = [];
        this.rectangles.push(createRectangle(this.scene, "src/assets/arrowLeft.png",  50, 150, 60, 0));
        this.rectangles.push(createRectangle(this.scene, "src/assets/arrowRight.png" , 50, 150, 390, 0));
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