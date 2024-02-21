import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { GlowFilter } from '@pixi/filter-glow';
import { Tetromino } from "./Object/Tetromino";
import { gsap } from 'gsap';
import { Graphics } from "./Graphics";
import { playBombExplodeSound, playDoubleComboSound, playRockCrashedSound, playSingleComboSound, playTripleComboSound } from "./Sound/Sound";
import { TetrisGame } from "./TetrisGame";
import * as RAPIER from "@dimforge/rapier2d";
import EXPLOSION_IMAGE from '@assets/explosion.png';
import * as particles from '@pixi/particle-emitter'
import { ITetrisObject } from "./Object/TetrisObject";

export const explodeParticleEffect = (x: number, y: number, graphics: Graphics) => {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    const viewport = graphics.viewport;
    const ticker = graphics.ticker;
    const particles: Array<() => void> = []; // 추가

    for (let i = 0; i < 100; i++) {
        const effectParticle = new PIXI.Sprite(PIXI.Texture.WHITE);
        effectParticle.tint = colors[Math.floor(Math.random() * colors.length)];
        effectParticle.width = effectParticle.height = Math.random() * 5 + 5;
        effectParticle.x = x + Math.random() * 32;
        effectParticle.y = y + Math.random() * 320;
        effectParticle.vx = Math.random() * 5 - 2.5;
        effectParticle.vy = Math.random() * 10 - 5;  // 세로 방향으로 이동하는 속도를 두 배로 늘림

        viewport.addChild(effectParticle);

        const updateParticle = () => { // 수정
            effectParticle.x += effectParticle.vx;
            effectParticle.y += effectParticle.vy;
            effectParticle.alpha -= 0.01;
            effectParticle.scale.x = effectParticle.scale.y += 0.01;

            if (effectParticle.alpha <= 0) {
                viewport.removeChild(effectParticle);
                ticker.remove(updateParticle); // 수정
                const index = particles.indexOf(updateParticle); // 추가
                if (index !== -1) {
                    particles.splice(index, 1); // 추가
                }
            }
        };

        particles.push(updateParticle); // 추가
    }

    particles.forEach((particle) => ticker.add(particle)); // 수정

    if (!ticker.started) {
        ticker.start();
    }
};

export function collisionParticleEffect(
    x: number,
    y: number,
    graphics: Graphics
): void {
    const viewport = graphics.viewport;
    const ticker = graphics.ticker;
    const particles: Array<() => void> = []; // 추가

    for (let i = 0; i < 10; i++) {
        const particle = generateParticleTexture(graphics.renderer);
        particle.position.set(x, y);
        particle.speed = Math.random() * 5;
        particle.direction = Math.random() * Math.PI * 2;
        particle.alpha = 1;
        viewport.addChild(particle);

        const updateParticle = () => {
            particle.x += Math.cos(particle.direction) * particle.speed;
            particle.y += Math.sin(particle.direction) * particle.speed;
            particle.alpha -= 0.01;

            if (particle.alpha <= 0) {
                viewport.removeChild(particle);
                ticker.remove(updateParticle); // 수정
                const index = particles.indexOf(updateParticle); // 추가
                if (index !== -1) {
                    particles.splice(index, 1); // 추가
                }
            }
        };
        particles.push(updateParticle); // 추가
    }
    particles.forEach((particle) => ticker.add(particle)); // 수정
    if (!ticker.started) {
        ticker.start();
    }
}

export function generateParticleTexture(renderer: PIXI.Renderer): PIXI.Sprite {
    const radius = 2;
    const particleGraphics = new PIXI.Graphics();
    particleGraphics.beginFill(0xffb6c1);
    particleGraphics.drawCircle(radius, radius, radius); // 원의 중심 좌표를 (radius, radius)로 이동
    particleGraphics.endFill();

    const renderTexture = PIXI.RenderTexture.create({
        width: radius * 2, // 원의 직경만큼 너비를 설정
        height: radius * 2 // 원의 직경만큼 높이를 설정
    });
    renderer.render(particleGraphics, { renderTexture });

    const particleSprite = new PIXI.Sprite(renderTexture);
    return particleSprite;
}

export function createRectangle(container: PIXI.Container, imagePath: string, width: number, height: number, x: number, y: number) {
    const rectangle = PIXI.Sprite.from(imagePath);
    rectangle.width = width;
    rectangle.height = height;
    rectangle.x = x;
    rectangle.y = y;
    container.addChild(rectangle);
    return rectangle;
}

export function performPushEffect(firstRectangle: PIXI.Sprite, secondRectangle: PIXI.Sprite, alpha: number, firstOriginal: number, secondOriginal: number) {
    gsap.killTweensOf(secondRectangle.position);
    secondRectangle.x = secondOriginal;

    firstRectangle.alpha = 1;
    secondRectangle.alpha = 0;

    let targetX = firstOriginal + 50 * alpha;
    targetX = alpha > 0 ? firstOriginal + 50 : firstOriginal - 50;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(firstRectangle.position, {
        duration: 1,
        x: `+=${50 * alpha}`,
        ease: "power1.inOut",
        onUpdate: function () {
            if (alpha > 0 && firstRectangle.position.x > targetX) {
                firstRectangle.position.x = targetX;
            } else if (alpha < 0 && firstRectangle.position.x < targetX) {
                firstRectangle.position.x = targetX;
            }
        }
    })
        .to(firstRectangle.position, {
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            x: `+=${10 * Math.sign(alpha)}`,
            ease: "sine.inOut"
        }, 0);
}

export function createScoreBasedGrid(lineGrids: PIXI.Graphics[], scoreList: number[], threshold: number) {
    for (let i = 0; i < lineGrids.length; i++) {
        const alpha = scoreList[i] / threshold;
        lineGrids[i].clear();
        lineGrids[i].beginFill(0xff00f0, alpha / 2);
        lineGrids[i].drawRect(0, -i * 32 + 588, 520, 32);
        lineGrids[i].endFill();
    }
}

export function lightEffectToLine(lineGrids: PIXI.Graphics[], index: number) {
    // Glow 효과를 위한 필터를 생성합니다.
    const glowFilter = new GlowFilter({
        color: 0xffff, // 노란색 빛
        distance: 35, // 빛의 거리
        quality: 0.5, // 빛의 품질
    });

    // 빛나는 효과를 주기 위해 필터를 설정합니다.
    lineGrids[index].filters = [glowFilter];

    // 색상을 잠시 노란색으로 변경합니다.
    lineGrids[index].clear();
    lineGrids[index].beginFill(0xffff00);
    lineGrids[index].drawRect(0, -index * 32 + 588, 520, 32);
    lineGrids[index].endFill();

    // 0.3초 후에 필터를 제거하고 색상을 원래대로 돌려놓습니다.
    setTimeout(() => {
        lineGrids[index].filters = [];
        lineGrids[index].clear();
        lineGrids[index].beginFill(0xff00f0, 0.25);
        lineGrids[index].drawRect(0, -index * 32 + 588, 520, 32);
        lineGrids[index].endFill();
    }, 300);
}


export function showScore(scoreList: number[], scoreTexts: PIXI.Text[], threshold: number) {
    for (let i = 0; i < scoreList.length; i++) {
        const alpha = scoreList[i] / threshold;
        scoreTexts[i].y = 600 - 32 * i;
        if (alpha >= 1) {
            scoreTexts[i].x = 0;
            scoreTexts[i].text = "폭파예정!";
            scoreTexts[i].style.fill = '#ff8000';
        }
        else if (alpha >= 0.95) {
            scoreTexts[i].x = 0;
            scoreTexts[i].text = "폭파직전!";
            scoreTexts[i].style.fill = '#ffff00';
        }
        else {
            scoreTexts[i].x = 0;
            scoreTexts[i].text = (alpha * 100).toFixed(0);
            scoreTexts[i].style.fill = '#fff';
        }
    }
}

interface ShakeOptions {
    viewport: Viewport;
    strength: number;
    duration: number;
}

export function startShake(options: ShakeOptions) {
    const { viewport, strength, duration } = options;

    let remainingDuration = duration;
    const ticker = new PIXI.Ticker();
    const originPosition = { x: viewport.position.x, y: viewport.position.y };

    ticker.add(() => {
        if (remainingDuration > 0) {
            viewport.position.set(
                originPosition.x + (Math.random() * strength * 2 - strength),
                originPosition.y + (Math.random() * strength * 2 - strength)
            );
            remainingDuration -= ticker.deltaMS;
        } else {
            viewport.position.set(originPosition.x, originPosition.y);
            ticker.stop();
        }
    });

    ticker.start();

    return ticker; // 추후에 ticker를 멈추기 위해 반환합니다.
}

export function fallingBlockGlow(fallingBlock: ITetrisObject, rgb: number) {
    const glowFilter = new GlowFilter({
        distance: 45,
        outerStrength: 2,
        color: rgb
    });

    fallingBlock.graphics.forEach(graphic => {
        graphic.filters = [...(graphic.filters || []), glowFilter];
    });
}

export function fallingBlockGlowWithDelay(fallingBlock: ITetrisObject) {
    setTimeout(function () {
        const glowFilter = new GlowFilter({
            distance: 45,
            outerStrength: 2,
            color: 0xffff
        });

        fallingBlock.graphics.forEach(graphic => {
            graphic.filters = [...(graphic.filters || []), glowFilter];
        });
    }, 50); // 100 밀리세컨드 후에 함수를 실행합니다.
}

export function changeBlockGlow(fallingBlock: ITetrisObject, colorIndex: number) {

    const colorList = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    const nextColorIndex = (colorIndex + 1) % colorList.length;

    const glowFilter = new GlowFilter({
        distance: 45,
        outerStrength: 2,
        color: colorList[nextColorIndex] // 색상 리스트에서 색상 선택
    });

    fallingBlock.graphics.forEach(graphic => {
        graphic.filters = [];
        graphic.filters = [glowFilter];
    });

    return nextColorIndex;
}

export function removeGlow(fallingBlock: Tetromino) {
    fallingBlock.graphics.forEach(graphic => {
        if (graphic.filters) {
            graphic.filters = graphic.filters.filter(filter => !(filter instanceof GlowFilter));
        }
    });
}

export function removeGlowWithDelay(fallingBlock: Tetromino) {
    setTimeout(function () {
        fallingBlock.graphics.forEach(graphic => {
            if (graphic.filters) {
                graphic.filters = graphic.filters.filter(filter => !(filter instanceof GlowFilter));
            }
        });
    }, 200); // 500 밀리세컨드 후에 함수를 실행합니다.
}

export function handleComboEffect(combo: number, graphics: Graphics): string {
    startShake({ viewport: graphics.viewport, strength: 5 + 10 * combo, duration: 400 + 50 * combo })
    if (combo === 1) {
        playSingleComboSound();
        return "Single Combo!";
    }
    else if (combo === 2) {
        playDoubleComboSound();
        explodeParticleEffect(300, 700, graphics);
        return "Double Combo!";
    }
    else {
        playTripleComboSound();
        explodeParticleEffect(300, 700, graphics);
        return "Fantastic!";
    }
}

export function lineGlowEffect(graphics: PIXI.Graphics) {
    const glowFilter = new GlowFilter({
        distance: 45,
        outerStrength: 2,
        color: 0xffff // 흰색
    });

    graphics.filters = [...(graphics.filters || []), glowFilter];

    gsap.delayedCall(0.3, function () {
        graphics.filters = graphics.filters!.filter(filter => filter !== glowFilter);
    });
}





export function explodeRock(game: TetrisGame, bodyA: RAPIER.Collider, bodyB: RAPIER.Collider, ver: number) {
    const explosionPoint = ver ? bodyA.translation() : bodyB.translation();
    const rigidBodyHandle = (ver ? bodyA : bodyB).parent()?.handle;
    const rigidBody = game.world!.getRigidBody(rigidBodyHandle!);
    rigidBody.setTranslation({ x: 10000, y: 0 }, false);
    playRockCrashedSound();
    rockParticleEffect(explosionPoint.x, -explosionPoint.y, game);
    const graphics = game.graphics.coll2gfx.get((ver ? bodyA : bodyB).handle);
        if (graphics) {
            game.graphics.viewport.removeChild(graphics);
            game.graphics.coll2gfx.delete((ver ? bodyA : bodyB).handle);
    }
}

export async function loadExplosionImage(): Promise<PIXI.Texture> {
    return await PIXI.Assets.load(EXPLOSION_IMAGE);
}

export const createExplosion = (viewport: Viewport, texture: PIXI.Texture, x: number, y: number) => {
    const explosion = new PIXI.Sprite(texture);
    explosion.width = 150;
    explosion.height = 150;
    explosion.anchor.set(0.5, 0.5);
    explosion.x = x;
    explosion.y = -y;
    viewport.addChild(explosion);
    setTimeout(() => {
        viewport.removeChild(explosion);
    }, 300);
};

export function showGameOverModal(message: string) {
    const modalMessage = document.getElementById('modal-message');
    const gameOverModal = document.getElementById('game-over-modal');
    console.log(modalMessage, gameOverModal);
    if (modalMessage && gameOverModal) {
        modalMessage.innerText = message;
        gameOverModal.style.display = 'block';
    } else {
        console.error('Modal elements not found');
    }
}

export function getNextBlockImage(nextBlock: string) {
    const imgPath = `src/assets/blocks/${nextBlock}block.png`
    return imgPath;
}

export function starWarp(concentrationLineRef: React.RefObject<HTMLCanvasElement>) {
    const graphics = new PIXI.Application({
        view: concentrationLineRef.current!,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
    });

    const starTexture = PIXI.Texture.from('https://pixijs.com/assets/star.png');
    const starAmount = 1000;
    let cameraZ = 0;
    const fov = 20;
    const baseSpeed = 0.025;
    let speed = 1;
    let warpSpeed = 0;
    const starStretch = 5;
    const starBaseSize = 0.05;
    const maxSpeed = 0.5;  // 최대 속도 설정

    function setWarpSpeed(newSpeed: number) {
        warpSpeed = newSpeed;
    }

    // Create the stars
    const stars: any = [];

    for (let i = 0; i < starAmount; i++) {
        const star = {
            sprite: new PIXI.Sprite(starTexture),
            z: 0,
            x: 0,
            y: 0,
        };

        star.sprite.anchor.x = 0.5;
        star.sprite.anchor.y = 0.7;
        randomizeStar(star, true);
        graphics.stage.addChild(star.sprite);
        stars.push(star);
    }

    function randomizeStar(star: any, initial: boolean) {
        star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;

        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }


    graphics.ticker.add((delta) => {
        speed += (warpSpeed - speed) / 20;
        speed = Math.min(speed, maxSpeed);
        cameraZ += delta * 10 * (speed + baseSpeed);
        for (let i = 0; i < starAmount; i++) {
            const star = stars[i];

            if (star.z < cameraZ) randomizeStar(star, false);

            const z = star.z - cameraZ;

            star.sprite.x = star.x * (fov / z) * graphics.renderer.screen.width + graphics.renderer.screen.width / 2;
            star.sprite.y = star.y * (fov / z) * graphics.renderer.screen.width + graphics.renderer.screen.height / 2;

            const dxCenter = star.sprite.x - graphics.renderer.screen.width / 2;
            const dyCenter = star.sprite.y - graphics.renderer.screen.height / 2;
            const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
            const distanceScale = Math.max(0, (2000 - z) / 2000);

            star.sprite.scale.x = distanceScale * starBaseSize;
            star.sprite.scale.y = distanceScale * starBaseSize
                + distanceScale * speed * starStretch * distanceCenter / graphics.renderer.screen.width;
            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
        }
    });
    graphics.ticker.start();

    return {
        setWarpSpeed,
    };
}

export function rockParticleEffect(x: number, y: number, game: TetrisGame ) {
  var emitter = new particles.Emitter(
    game.graphics.viewport,

    {
        lifetime: {
            min: 1,
            max: 2
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 0.31,
        maxParticles: 5,
        pos: {
            x: x,
            y: y
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
                                value: 0.2,
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
                        x: 0,
                        y: 0,
                        radius: 10
                    }
                }
            },
            {
                type: 'textureSingle',
                config: {
                    texture: PIXI.Texture.from('src/assets/Stone.png')
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

