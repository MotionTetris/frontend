import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import * as RAPIER from "@dimforge/rapier2d";
import { TetrisOption } from "./TetrisOption";
import { createRectangle } from "./Effect";
const BOX_INSTANCE_INDEX = 0;
const BALL_INSTANCE_INDEX = 1;

let kk = 0;

export class Graphics {
    coll2gfx: Map<number, PIXI.Graphics>;
    colorIndex: number;
    colorPalette: Array<number>;
    renderer: PIXI.Renderer;
    scene: PIXI.Container; 
    viewport: Viewport;
    instanceGroups: Array<Array<PIXI.Graphics>>;
    rectangles: Array<PIXI.Sprite>;
    ticker: PIXI.Ticker;
    constructor(option: TetrisOption) {
        // High pixel Ratio make the rendering extremely slow, so we cap it.
        const pixelRatio = window.devicePixelRatio ? Math.min(window.devicePixelRatio, 1.5) : 1;

        this.coll2gfx = new Map();
        this.colorIndex = 0;
        this.colorPalette = [0xf3d9b1, 0x98c1d9, 0x053c5e, 0x1f7a8c];
        this.renderer = new PIXI.Renderer({
            backgroundColor: 0x222929,
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
            interaction: this.renderer.plugins.interaction,
        });

        this.scene.addChild(this.viewport);
    
        this.viewport.drag().pinch().wheel().decelerate();
        this.rectangles = [];
        this.rectangles.push(createRectangle(this.scene, "src/assets/arrowLeft.png",  50, 150, 80, 0));
        this.rectangles.push(createRectangle(this.scene, "src/assets/arrowRight.png" , 50, 150, 470, 0));
        this.rectangles.push(createRectangle(this.scene, "src/assets/arrowLeft.png", 50, 150, 10, 370));
        this.rectangles.push(createRectangle(this.scene, "src/assets/arrowRight.png", 50, 150, 550, 370));
        this.ticker = new PIXI.Ticker();
        
        function onContextMenu(event: UIEvent) {
            event.preventDefault();
        }

        document.oncontextmenu = onContextMenu;
        document.body.oncontextmenu = onContextMenu;
        this.viewport.setTransform(0, 100);
        this.instanceGroups = [];
        this.initInstances();   
    }

    initInstances() {
        this.instanceGroups.push(
            this.colorPalette.map((color) => {
                const graphics = new PIXI.Graphics();
                graphics.beginFill(color);
                graphics.drawRect(-1.0, 1.0, 2.0, -2.0);
                graphics.endFill();
                return graphics;
            }),
        );

        this.instanceGroups.push(
            this.colorPalette.map((color) => {
                const graphics = new PIXI.Graphics();
                graphics.beginFill(color);
                graphics.drawCircle(0.0, 0.0, 1.0);
                graphics.endFill();
                return graphics;
            }),
        );
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

    addCollider(collider: RAPIER.Collider, color?: number, alpha?: number): PIXI.Graphics | undefined
    addCollider(collider: RAPIER.Collider): PIXI.Graphics | undefined
    addCollider(collider: RAPIER.Collider, color?: number, alpha?: number): PIXI.Graphics | undefined {
        if (!color) {
            return this.addColliderWithDefualtColor(collider);
        }

        return this.addColliderWithColor(collider, color, alpha);
    }

    private addColliderWithColor(collider: RAPIER.Collider, color: number, alpha: number = 1.0) {
        let graphics = new PIXI.Graphics();
        let vertices;

        if (!graphics) {
            console.error("Failed to create graphics");
            return;
        }
        
        if (alpha < 0 && alpha > 1) {
            console.error(`Invalid alpha ${alpha}`);
            return;
        }

        switch (collider.shapeType()) {
            case RAPIER.ShapeType.Cuboid:
                const hext = collider.halfExtents();
                graphics.beginFill(color, alpha);
                graphics.drawRect(-1.0, 1.0, 2.0, -2.0);
                graphics.endFill();
                graphics.scale.x = hext.x;
                graphics.scale.y = hext.y;
                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.Ball:
                const rad = collider.radius();
                graphics.beginFill(color, alpha);
                graphics.drawRect(-1.0, 1.0, 2.0, -2.0);
                graphics.endFill();
                graphics.scale.x = rad;
                graphics.scale.y = rad;
                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.Polyline:
                vertices = Array.from(collider.vertices());
                graphics.lineStyle(0.2, color, alpha).moveTo(vertices[0], -vertices[1]);

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
                graphics.lineStyle(0.2, color, alpha).moveTo(-scale.x / 2.0, -heights[0] * scale.y);

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
                graphics.beginFill(color, alpha);
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

        const translation = collider.translation();
        const rotation = collider.rotation();
        graphics.position.x = translation.x;
        graphics.position.y = -translation.y;
        graphics.rotation = rotation;

        this.coll2gfx.set(collider.handle, graphics);
        this.colorIndex = (this.colorIndex + 1) % (this.colorPalette.length - 1);
        
        return graphics;
    }

    private addColliderWithDefualtColor(collider: RAPIER.Collider) {
        const parent = collider.parent();
        let instance;
        let graphics;
        let vertices;
        const instanceId = parent!.isFixed() ? 0 : this.colorIndex + 1;

        switch (collider.shapeType()) {
            case RAPIER.ShapeType.Cuboid:
                const hext = collider.halfExtents();
                instance = this.instanceGroups[BOX_INSTANCE_INDEX][instanceId];
                graphics = instance.clone();
                graphics.scale.x = hext.x;
                graphics.scale.y = hext.y;
                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.Ball:
                const rad = collider.radius();
                instance = this.instanceGroups[BALL_INSTANCE_INDEX][instanceId];
                graphics = instance.clone();
                graphics.scale.x = rad;
                graphics.scale.y = rad;
                this.viewport.addChild(graphics);
                break;
            case RAPIER.ShapeType.Polyline:
                vertices = Array.from(collider.vertices());
                graphics = new PIXI.Graphics();
                graphics
                    .lineStyle(0.2, this.colorPalette[instanceId])
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
                    .lineStyle(0.2, this.colorPalette[instanceId])
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
                graphics.beginFill(this.colorPalette[instanceId], 1.0);
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
        this.colorIndex = (this.colorIndex + 1) % (this.colorPalette.length - 1);
        
        return graphics;
    }
}