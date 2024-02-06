import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import type * as RAPIER from "@dimforge/rapier2d";
import { createLineEffect, createRectangle} from "./Effect";
import { TetrisOption } from "./TetrisOption";

type RAPIER_API = typeof import("@dimforge/rapier2d");

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
    lines: PIXI.Graphics;
    rectangles: Array<PIXI.Graphics>;
    ticker: PIXI.Ticker;
    constructor(canvas: HTMLCanvasElement, option: TetrisOption) {
        // High pixel Ratio make the rendering extremely slow, so we cap it.
        // const pixelRatio = window.devicePixelRatio ? Math.min(window.devicePixelRatio, 1.5) : 1;

        this.coll2gfx = new Map();
        this.colorIndex = 0;
        this.colorPalette = [0xf3d9b1, 0x98c1d9, 0x053c5e, 0x1f7a8c];
        this.renderer = new PIXI.Renderer({
            backgroundColor: 0x222929,
            antialias: true,
            // resolution: pixelRatio,
            width: canvas.width,
            height: canvas.height,
            view: canvas
        });

        this.scene = new PIXI.Container();

        //this.particleContainer = new PIXI.ParticleContainer(100, { alpha: true, scale: true });
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
        this.rectangles.push(createRectangle(this.scene, 50, 350, 10, 0));
        this.rectangles.push(createRectangle(this.scene, 50, 350, 550, 0));
        this.rectangles.push(createRectangle(this.scene, 50, 350, 10, 370));
        this.rectangles.push(createRectangle(this.scene, 50, 350, 550, 370));
        this.ticker = new PIXI.Ticker();
        

        const me = this;

        function onWindowResize() {
            //me.renderer.resize(window.innerWidth, window.innerHeight);
        }

        function onContextMenu(event: UIEvent) {
            event.preventDefault();
        }

        document.oncontextmenu = onContextMenu;
        document.body.oncontextmenu = onContextMenu;
        this.viewport.setTransform(0, 100);
        window.addEventListener("resize", onWindowResize, false);
        
        this.initInstances();   
    }

    initInstances() {
        this.instanceGroups = [];
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

    render(world: RAPIER.World, debugRender: boolean) {
        kk += 1;
        if (!this.lines) {
            this.lines = new PIXI.Graphics();
            this.viewport.addChild(this.lines);
        }

        if (debugRender) {
            const buffers = world.debugRender();
            const vtx = buffers.vertices;
            const cls = buffers.colors;

            this.lines.clear();

            for (let i = 0; i < vtx.length / 4; i += 1) {
                const color = PIXI.utils.rgb2hex([
                    cls[i * 8],
                    cls[i * 8 + 1],
                    cls[i * 8 + 2],
                ]);
                this.lines.lineStyle(1.0, color, cls[i * 8 + 3], 0.5, true);
                this.lines.moveTo(vtx[i * 4], -vtx[i * 4 + 1]);
                this.lines.lineTo(vtx[i * 4 + 2], -vtx[i * 4 + 3]);
            }
        } else {
            this.lines.clear();
        }

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

    addCollider(
        RAPIER: RAPIER_API,
        world: RAPIER.World,
        collider: RAPIER.Collider,
        color?: number
    ) {
        let i;
        const parent = collider.parent();
        let instance;
        let graphics;
        let vertices;
        const instanceId = parent.isFixed() ? 0 : this.colorIndex + 1;

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

                for (i = 2; i < vertices.length; i += 2) {
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

                for (i = 1; i < heights.length; i += 1) {
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

                for (i = 2; i < vertices.length; i += 2) {
                    graphics.lineTo(vertices[i], -vertices[i + 1]);
                }

                this.viewport.addChild(graphics);
                break;
            default:
                console.log("Unknown shape to render.");
                break;
        }

        const t = collider.translation();
        const r = collider.rotation();
        //        dummy.position.set(t.x, t.y, t.z);
        //        dummy.quaternion.set(r.x, r.y, r.z, r.w);
        //        dummy.scale.set(instanceDesc.scale.x, instanceDesc.scale.y, instanceDesc.scale.z);
        //        dummy.updateMatrix();
        //        instance.setMatrixAt(instanceDesc.elementId, dummy.matrix);
        //        instance.instanceMatrix.needsUpdate = true;
        graphics.position.x = t.x;
        graphics.position.y = -t.y;
        graphics.rotation = r;

        this.coll2gfx.set(collider.handle, graphics);
        this.colorIndex =
            (this.colorIndex + 1) % (this.colorPalette.length - 1);

        return graphics;
    }
}