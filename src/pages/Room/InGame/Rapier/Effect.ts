import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import {GlowFilter} from '@pixi/filter-glow';
import { Tetromino } from "./Tetromino";
import { gsap } from 'gsap';
import { Graphics } from "./Graphics";

import { playDoubleComboSound, playSingleComboSound, playTripleComboSound } from "./Sound";
import { TetrisGame } from "./TetrisGame";
import * as particles from '@pixi/particle-emitter'
export const explodeParticleEffect = (x: number, y: number, graphics: Graphics ) => {
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


export const starParticleEffect = (x: number, y: number, graphics: Graphics,  starTexture: PIXI.Texture) => {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
  const viewport = graphics.viewport;
  const ticker = graphics.ticker;
  const particles: Array<() => void> = []; // 추가

  for (let i = 0; i < 10; i++) {
    const effectParticle = new PIXI.Sprite(starTexture);
    effectParticle.tint = colors[Math.floor(Math.random() * colors.length)];
    const scale = Math.random() * 0.5 + 0.01;
    effectParticle.scale.set(scale);
    effectParticle.x = x;
    effectParticle.y = y;
    effectParticle.vx = Math.random() * 1 - 0.1;
    effectParticle.vy = -(Math.random() * 5 + 0.5);
    viewport.addChild(effectParticle);

    const updateParticle = () => {
      effectParticle.x += effectParticle.vx;
      effectParticle.y += effectParticle.vy;
      effectParticle.alpha -= 0.01;
      effectParticle.scale.x = effectParticle.scale.y += 0.0001;

      if (effectParticle.alpha <= 0) {
        viewport.removeChild(effectParticle);
        ticker.remove(updateParticle);
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


export function explodeImageEffect(
  explosionSprite: PIXI.DisplayObject, 
  app: PIXI.Application, 
  i: number
): void {
  explosionSprite.alpha = 1; // 알파값 초기화

  // 스프라이트가 이미 부모에 추가되어 있으면 제거
  if (explosionSprite.parent) { 
      explosionSprite.parent.removeChild(explosionSprite);
  }

  // 스프라이트 위치 설정 및 추가
  explosionSprite.x = 140;
  explosionSprite.y = i * 32 - 200;
  explosionSprite.alpha = 0.5;
  app.stage.addChild(explosionSprite);


  let ticker = PIXI.Ticker.shared;
          let timeElapsed = 0; // 경과 시간
          const handleTick = (deltaTime: number) => {
            timeElapsed += deltaTime;
            if (timeElapsed >= 60) { // 약 1초 후
              ticker.remove(handleTick); // 애니메이션 제거
              if (explosionSprite.parent) { // 스프라이트가 부모에 추가되어 있다면 제거
                explosionSprite.parent.removeChild(explosionSprite);
              }
            }
          };
          ticker.add(handleTick);
}



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
  // 진행 중인 애니메이션 중단
  gsap.killTweensOf(secondRectangle.position);

  // 두 번째 사각형의 위치를 원래 위치로 복원
  secondRectangle.x = secondOriginal;

  firstRectangle.alpha = 1;
  secondRectangle.alpha = 0;

  let targetX = firstOriginal + 50 * alpha;
  targetX = alpha > 0 ? firstOriginal + 50 : firstOriginal - 50;

  let tl = gsap.timeline({repeat: -1, yoyo: true});

  tl.to(firstRectangle.position, { 
    duration: 1, 
    x: `+=${50 * alpha}`, 
    ease: "power1.inOut",
    onUpdate: function() {
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



export function createScoreBasedGrid(lineGrids: PIXI.Graphics[], scoreList: number [], threshold: number) {
  for (let i = 0; i < lineGrids.length; i++) {
    const alpha = scoreList[i] / threshold; // 점수를 투명도로 변환 (0 ~ 1 사이의 값)
    lineGrids[i].clear();
    lineGrids[i].beginFill(0xff00f0, alpha/4);
    lineGrids[i].drawRect(100, -i * 32 +588, 420, 32); // 32픽셀 간격으로 높이를 설정
    lineGrids[i].endFill();
  }  
}


export function showScore(scoreList: number [], scoreTexts : PIXI.Text[], threshold: number) { 
  for (let i = 0; i < scoreList.length; i++) {
    let alpha = scoreList[i]/threshold;
    scoreTexts[i].x = 70;
    scoreTexts[i].y = 600 - 32*i;
    scoreTexts[i].text = (alpha * 100).toFixed(0);
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


export function fallingBlockGlow(fallingBlock: Tetromino) {
  const glowFilter = new GlowFilter({ 
    distance: 45, 
    outerStrength: 2,
    color: 0xffff 
  });
  
  fallingBlock.graphics.forEach(graphic => {
    graphic.filters = [...(graphic.filters || []), glowFilter];
  });
}

export function fallingBlockGlowWithDelay(fallingBlock: Tetromino) {
  setTimeout(function() {
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


export function changeBlockGlow(fallingBlock: Tetromino, colorIndex: number) {
  
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
  setTimeout(function() {
    fallingBlock.graphics.forEach(graphic => {
      if (graphic.filters) {
        graphic.filters = graphic.filters.filter(filter => !(filter instanceof GlowFilter));
      }
    });
  }, 200); // 500 밀리세컨드 후에 함수를 실행합니다.
}



export function loadStarImage() {
  return new Promise((resolve, reject) => {
    if (PIXI.Loader.shared.resources['src/assets/whitestar.png']) {
      // 이미 로드된 이미지라면 즉시 resolve를 호출.
      resolve(PIXI.Loader.shared.resources['src/assets/whitestar.png'].texture);
    } else {
      PIXI.Loader.shared.add('src/assets/whitestar.png').load((loader, resources) => {
        if (resources['src/assets/whitestar.png']) {
          console.log("스타 이미지 로드 성공");
          resolve(resources['src/assets/whitestar.png'].texture);
        } else {
          reject("스타 이미지 로드 실패");
        }
      });
    }
  });
}


export function handleComboEffect(combo: number, graphics: Graphics): string {
  startShake({ viewport: graphics.viewport, strength: 5 + 10 * combo, duration: 400 + 50 * combo})
  if (combo === 1) {
    playSingleComboSound();
    return "Single Combo!";
  }
  else if (combo === 2) {
    playDoubleComboSound();
    return "Double Combo!";
  }
  else {
    playTripleComboSound();
    explodeParticleEffect(300, 700, graphics);
    return "Fantastic!";
  }
}


//item-region

export function rotateViewport(viewport: Viewport, degree: number) {
  console.log("original", viewport.x);
  const angleInRadians = degree * (Math.PI / 180);
  viewport.rotation = angleInRadians;
  viewport.scale.x *= 0.8;
  viewport.scale.y *= 0.8;
  if (degree < 0) {
    ;
  }
  else {
    viewport.x += 200;
  }
  
}

export function resetRotateViewport(viewport: Viewport) {
  viewport.rotation = 0;
  viewport.scale.x = 1;
  viewport.scale.y = 1;
  viewport.x = 0;;
}


export function flipViewport(viewport: Viewport) {
  // 좌우 반전
  viewport.scale.x = -1;
  viewport.x += 600;
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
            min: 1,
            max: 2
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
                                value: 200,
                                time: 0
                            },
                            {
                                value: 100,
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



export function lineGlowEffect(graphics: PIXI.Graphics) {
  const glowFilter = new GlowFilter({ 
    distance: 45, 
    outerStrength: 2,
    color: 0xffff // 흰색
  });

  graphics.filters = [...(graphics.filters || []), glowFilter];

  gsap.delayedCall(0.3, function() {
    graphics.filters = graphics.filters!.filter(filter => filter !== glowFilter);
  });
}