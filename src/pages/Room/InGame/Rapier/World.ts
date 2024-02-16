import { WallType } from "./TetrisContants";
import { TetrisOption } from "./TetrisOption";

type RAPIER_API = typeof import("@dimforge/rapier2d");

export function initWorld(RAPIER: RAPIER_API, option: TetrisOption) {
    const gravity = new RAPIER.Vector2(0.0, -100);
    const world = new RAPIER.World(gravity);
    const wall = createWall(option.worldWidth, option.worldHeight, 10, 20, option.blockSize);
    
    wall.forEach((ground) => {
        const bodyDesc = RAPIER.RigidBodyDesc
                             .fixed()
                             .setTranslation(ground.x,ground.y)
                             .setUserData({type: ground.label, color: option.wallColor, alpha: option.wallAlpha});

        const body = world.createRigidBody(bodyDesc);

        const colliderDesc = RAPIER.ColliderDesc
                                 .cuboid(ground.hx, ground.hy)
                                 .setRestitution(option.blockRestitution)
                                 .setFriction(option.blockFriction);
        if (ground.label === WallType.GROUND) {
            colliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }

        world.createCollider(colliderDesc, body);
    });

    return world;
}

function createWall(viewportWidth: number, viewportHeight: number, width: number, height: number, blockSize: number) {
    const wall_thick = 20;
    
    const ground = {
        x: viewportWidth / 2,
        y: -height * blockSize,
        hx: viewportWidth,
        hy: wall_thick,
        label: WallType.GROUND
    }   

    const left_wall = {
        x: viewportWidth / 2 - width / 2 * blockSize - wall_thick / 2 - 150,
        y: 0,
        hx: wall_thick, 
        hy: viewportHeight,
        label: WallType.LEFT_WALL
    }

    const right_wall = {
        x: viewportWidth / 2 + width / 2 * blockSize + wall_thick + 50, 
        y: 0,
        hx: wall_thick,
        hy: viewportHeight,
        label: WallType.RIGHT_WALL
    }

    return [ground, left_wall, right_wall];
}