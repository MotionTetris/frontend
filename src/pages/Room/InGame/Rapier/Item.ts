import * as PIXI from "pixi.js";
import RAPIER from "@dimforge/rapier2d";
import { playBombSpawnSound, playFlipSound } from "./Sound";
import { TetrisGame } from "./TetrisGame";
import { Viewport } from "pixi-viewport";
import * as particles from '@pixi/particle-emitter'
import { BOMB_URL,FOG_URL,FLIP_URL,ROTATE_LEFT_URL,ROTATE_RIGHT_URL } from "../../../../config"

//item-region
export function getRandomItem(game: TetrisGame) {
    const itemImage = [BOMB_URL,FOG_URL,FLIP_URL,ROTATE_LEFT_URL,ROTATE_RIGHT_URL];
    const randomIndex = Math.floor(Math.random() * itemImage.length);
    const randomURL = itemImage[randomIndex];
    
    switch(randomIndex) {
        case 0:
            spawnBomb(game, 300, 0 );
            break;
        case 1:
            addFog(game);
            break;
        case 2:
            flipViewport(game.graphics.viewport);
            break;
        case 3:
            rotateViewport(game.graphics.viewport, 15);
            break;
        case 4:
            rotateViewport(game.graphics.viewport, -15);
            break;
        default:
            console.log('Invalid index');
    }

    return randomURL;
}


export function spawnBomb(game: TetrisGame, x: number, y: number): number {
    playBombSpawnSound();
    let radius = 50;
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
    let rigidBody = game.world?.createRigidBody(rigidBodyDesc);
    rigidBody!.userData = {type: 'bomb'};
    let colliderDesc = RAPIER.ColliderDesc.ball(radius).setMass(100000);
    let collider = game.world?.createCollider(colliderDesc, rigidBody);
    let graphics = new PIXI.Graphics();  
    graphics.beginFill(0xFF0000); // 빨간색
    graphics.drawCircle(0, 0, radius);
    graphics.endFill();
    game.graphics.viewport.addChild(graphics);
    game.graphics.coll2gfx.set(collider!.handle, graphics);

    setTimeout(() => {
      //game.world!.removeCollider(collider!, false);
    rigidBody?.setTranslation({x: -10000, y: 0}, false);
    game.graphics.viewport.removeChild(graphics);
    game.graphics.coll2gfx.delete(collider!.handle);
    }, 5000);  
    return collider!.handle;

}


export function rotateViewport(viewport: Viewport, degree: number) {
    console.log("original", viewport.x);
    const angleInRadians = degree * (Math.PI / 180);
    viewport.rotation = angleInRadians;
    viewport.scale.x *= 0.8;
    viewport.scale.y *= 0.8;
    if (degree < 0) {
    ;
    }
    else 
    {
        viewport.x += 200;
    }
    // 5초 후에 resetRotateViewport 함수 호출
    setTimeout(() => {
        resetRotateViewport(viewport);
    }, 5000);
}


export function resetRotateViewport(viewport: Viewport) {
  viewport.rotation = 0;
  viewport.scale.x = 1;
  viewport.scale.y = 1;
  viewport.x = 0;;
}


export function flipViewport(viewport: Viewport) {
  playFlipSound();
  viewport.scale.x = -1;
  viewport.x += 600;
  setTimeout(() => {
    resetFlipViewport(viewport);
  }, 5000);
}

export function resetFlipViewport(viewport: Viewport) {
  viewport.scale.x = 1;
  viewport.x -= 600;
}


export function addFog(game: TetrisGame) {
  var emitter = new particles.Emitter(
    game.graphics.viewport,

    {
        lifetime: {
            min: 3,
            max: 6
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 0.31,
        maxParticles: 1000,
        pos: {
            x: 0,
            y: 0
        },
        addAtBack: false,
        behaviors: [
            {
                type: 'alpha',
                config: {
                    alpha: {
                        list: [
                            {
                                value: 0.8,
                                time: 0
                            },
                            {
                                value: 0.1,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'scale',
                config: {
                    scale: {
                        list: [
                            {
                                value: 1,
                                time: 0
                            },
                            {
                                value: 0.3,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'moveSpeed',
                config: {
                    speed: {
                        list: [
                            {
                                value: 100,
                                time: 0
                            },
                            {
                                value: 50,
                                time: 1
                            }
                        ],
                        isStepped: false
                    },
                }
            },
            {
                type: 'rotationStatic',
                config: {
                    min: 0,
                    max: 360
                }
            },
            {
                type: 'spawnShape',
                config: {
                    type: 'torus',
                    data: {
                        x: 300,
                        y: 500,
                        radius: 10
                    }
                }
            },
            {
                type: 'textureSingle',
                config: {
                    texture: PIXI.Texture.from('src/assets/fog.png')
                }
            }
        ],
    }
);
  game.graphics.ticker.add((delta) => {
    emitter.update(delta * 0.01);
  });

  emitter.emit = true;
  game.graphics.ticker.start();
};