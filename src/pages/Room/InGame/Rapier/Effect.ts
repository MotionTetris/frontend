import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import {GlowFilter} from '@pixi/filter-glow';
import { Tetromino } from "./Tetromino";
import { gsap } from 'gsap';
import { Graphics } from "./Graphics";
import { number } from "prop-types";
import Tetris from "../Tetris";
import { playDoubleComboSound, playSingleComboSound, playTripleComboSound } from "./Sound";

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
  console.log("First,", firstRectangle);
  console.log("Second,", secondRectangle);
  firstRectangle.alpha = 1;
  secondRectangle.alpha = 0;
  secondRectangle.x = secondOriginal;


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




  export function createLineEffect(i: number, viewport: Viewport, lines: PIXI.Graphics[]): void {
    let line = new PIXI.Graphics();
    line.lineStyle(1, 0xFFF000, 0.2); // 선의 두께는 1, 색상은 검정색, 투명도는 1(불투명)
    line.beginFill(0x000000, 0); 
    line.drawRect(100, i * 32 - 20, 420, 32); // 32픽셀 간격으로 높이를 설정
    line.endFill();
    line.name = 'lineGrid'
    lines.push(line); // lines 배열에 추가
    viewport.addChild(line); // stage에 추가
}


export function createScoreBasedGrid(viewport: Viewport, scoreList: number []) {
  //make lineGrids
  let lineGrids: PIXI.Graphics[] = [];
   // Clean up the old grids
  for (let i = 0; i < viewport.children.length; i++) {
    if (viewport.children[i].name === 'lineGrid') {
      viewport.removeChild(viewport.children[i]);
      i--; // Adjust index due to removal of child
    }
  }
  for (let i = 0 ; i < 20; i ++) {
      createLineEffect(i, viewport, lineGrids);
  }
  for (let i = 0; i < lineGrids.length; i++) {
    const alpha = scoreList[i]/ 10000; // 점수를 투명도로 변환 (0 ~ 1 사이의 값)
    console.log("alpha", alpha);
    let line = lineGrids[i];
    line.clear(); // 이전 라인 스타일 제거
  
    line.beginFill(0xff00f0, alpha/4);
    line.filters = null; // glow 효과 제거
    
    line.drawRect(100, -i * 32 + 588, 410, 32); // 32픽셀 간격으로 높이를 설정
    line.endFill();
  }  
}


export function showScore(viewport: Viewport, scoreList: number [], scoreTexts : PIXI.Text[], threshold: number): PIXI.Text[] {
  console.log("length", scoreTexts.length);
  for (let i = 0; i < scoreTexts.length; i++) {
    if (viewport.children.includes(scoreTexts[i])) {
      viewport.removeChild(scoreTexts[i]);
    }
  }
  
  let newScoreTexts: PIXI.Text[] = []; // 새로운 배열 생성
  
  for (let i = 0; i < scoreList.length; i++) {
    console.log("들어옴?");
    let alpha = scoreList[i]/threshold;
    let scoreText: PIXI.Text;
    scoreText = new PIXI.Text((alpha * 100).toFixed(2), {fontFamily : 'Arial', fontSize: 20, fill : 0xffffff, align : 'center'}); 
    scoreText.x = 60;
    scoreText.y = 600 - 32*i;
    newScoreTexts[i] = scoreText; // 새로운 배열에 추가
    viewport.addChild(scoreText);

    // alpha가 0.95보다 크면, 폭파직전! 이라는 노란색 움직이는 글씨를 띄워준다.
    if (alpha > 0.55) {
      let warningText: PIXI.Text;
      warningText = new PIXI.Text('폭파 직전!', {fontFamily : 'Arial', fontSize: 20, fill : 0xffff00, align : 'center'}); // 노란색
      warningText.x = 600;
      warningText.y = 560 - 32*i; // scoreText 위에 위치
      viewport.addChild(warningText);
      
      // GSAP 애니메이션 추가
      gsap.fromTo(warningText.scale, {
        x: 1,
        y: 1
      }, {
        x: 1.1,
        y: 1.1,
        duration: 0.3, // 0.3초 동안
        repeat: -1, // 무한 반복
        yoyo: true // 원래 크기로 돌아옴
      });
    }
  }

  return newScoreTexts; // 새로운 배열 반환
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


export function changeBlockGlow(fallingBlock: Tetromino, colorIndex: number) {
  // 색상 리스트
  const colorList = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

  // 인덱스를 증가시키고, 색상 리스트의 길이에 도달하면 0으로 초기화
  const nextColorIndex = (colorIndex + 1) % colorList.length;

  // 새로운 색상으로 GlowFilter 생성
  const glowFilter = new GlowFilter({ 
    distance: 45, 
    outerStrength: 2,
    color: colorList[nextColorIndex] // 색상 리스트에서 색상 선택
  });

  fallingBlock.graphics.forEach(graphic => {
    // 모든 필터 제거
    graphic.filters = [];
    // 새 GlowFilter 추가
    graphic.filters = [glowFilter];
  });

  // 다음 색상의 인덱스를 반환
  return nextColorIndex;
}


export function removeGlow(fallingBlock: Tetromino) {
  fallingBlock.graphics.forEach(graphic => {
    if (graphic.filters) {
      // GlowFilter 인스턴스를 찾아 제거
      graphic.filters = graphic.filters.filter(filter => !(filter instanceof GlowFilter));
    }
  });
}


export function loadStarImage() {
  return new Promise((resolve, reject) => {
    if (PIXI.Loader.shared.resources['src/assets/whitestar.png']) {
      // 이미 로드된 이미지라면 즉시 resolve를 호출합니다.
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
