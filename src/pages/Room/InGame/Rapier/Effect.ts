import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import {GlowFilter} from '@pixi/filter-glow';
import { Tetromino } from "./Tetromino";
// 폭발 효과 함수 (정사각형 흩어지는 효과)
// export const explodeParticleEffect = (x: number, y: number, viewport: Viewport) => {
//   for (let i = 0; i < 100; i++) {
//       const effectParticle = new PIXI.Sprite(PIXI.Texture.WHITE);
//       effectParticle.tint = 0xff0000;
//       effectParticle.width = effectParticle.height = Math.random() * 5 + 5;
//       effectParticle.x = x + Math.random() * 320;
//       effectParticle.y = y + Math.random() * 32;
//       effectParticle.vx = Math.random() * 5 - 2.5;
//       effectParticle.vy = Math.random() * 5 - 2.5;

//       viewport.addChild(effectParticle);

//       let ticker = new PIXI.Ticker();
//       ticker.add(() => {
//           effectParticle.x += effectParticle.vx;
//           effectParticle.y += effectParticle.vy;
//           effectParticle.alpha -= 0.01;
//           effectParticle.scale.x = effectParticle.scale.y += 0.01;

//           if (effectParticle.alpha <= 0) {
//               viewport.removeChild(effectParticle);
//               ticker.stop();
//           }
//       });

//       ticker.start();
//   }
// };

export const explodeParticleEffect = (x: number, y: number, viewport: Viewport) => {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
  for (let i = 0; i < 100; i++) {
      const effectParticle = new PIXI.Sprite(PIXI.Texture.WHITE);
      effectParticle.tint = colors[Math.floor(Math.random() * colors.length)];
      effectParticle.width = effectParticle.height = Math.random() * 5 + 5;
      effectParticle.x = x + Math.random() * 32;
      effectParticle.y = y + Math.random() * 320;
      effectParticle.vx = Math.random() * 5 - 2.5;
      effectParticle.vy = Math.random() * 10 - 5;  // 세로 방향으로 이동하는 속도를 두 배로 늘림

      viewport.addChild(effectParticle);

      let ticker = new PIXI.Ticker();
      ticker.add(() => {
          effectParticle.x += effectParticle.vx;
          effectParticle.y += effectParticle.vy;
          effectParticle.alpha -= 0.01;
          effectParticle.scale.x = effectParticle.scale.y += 0.01;

          if (effectParticle.alpha <= 0) {
              viewport.removeChild(effectParticle);
              ticker.stop();
          }
      });

      ticker.start();
  }
};




export const starParticleEffect = (x: number, y: number, viewport: Viewport) => {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

  for (let i = 0; i < 10; i++) {
    const effectParticle = new PIXI.Sprite(PIXI.Texture.from('../src/assets/star.png')); // 별 모양 이미지로 스프라이트 생성
    effectParticle.tint = colors[Math.floor(Math.random() * colors.length)]; // 무작위 색상 적용
    const scale = Math.random() * 0.1 + 0.01; // 0.5 ~ 1.0 사이의 무작위 스케일
    effectParticle.scale.set(scale);
    effectParticle.x = x;
    effectParticle.y = y;
    effectParticle.vx = Math.random() * 1 - 0.1;
    effectParticle.vy = -(Math.random() * 5 + 0.5);

    const glowFilter = new GlowFilter({
      distance: 15,
      outerStrength: 20,
      color: effectParticle.tint,
    });
    effectParticle.filters = [glowFilter];

    viewport.addChild(effectParticle);

    let ticker = new PIXI.Ticker();
    ticker.add(() => {
      effectParticle.x += effectParticle.vx;
      effectParticle.y += effectParticle.vy;
      effectParticle.alpha -= 0.01;
      effectParticle.scale.x = effectParticle.scale.y += 0.0001;

      if (effectParticle.alpha <= 0) {
        viewport.removeChild(effectParticle);
        ticker.stop();
      }
    });

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
    viewport: Viewport,
    renderer: PIXI.Renderer
  ): void {
    for (let i = 0; i < 10; i++) {
  
        const particle = generateParticleTexture(renderer);
  
        particle.position.set(
          x, y
        ); // 파티클 위치
  
        particle.speed = Math.random() * 5; // 파티클 속도
        particle.direction = Math.random() * Math.PI * 2; // 파티클 방향
        particle.alpha = 1; // 파티클 초기 투명도
        viewport.addChild(particle);
  
        // 파티클 움직임과 소멸
        let ticker = new PIXI.Ticker();
        ticker.add(() => {
          particle.x += Math.cos(particle.direction) * particle.speed;
          particle.y += Math.sin(particle.direction) * particle.speed;
          particle.alpha -= 0.01; // 점차 투명도 감소
          if (particle.alpha <= 0) {
            // 투명도가 0이 되면 파티클 제거
            viewport.removeChild(particle);
            ticker.stop();
          }
        });
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
  
  


export function createRectangle(container: PIXI.Container, width: number, height: number, x: number, y: number) {
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x0000c0, 0);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.x = x;
    rectangle.y = y;
    container.addChild(rectangle);
    return rectangle;
}


export function performRotateEffect(rectangle: PIXI.Graphics, ticker: PIXI.Ticker, color: number) {
  rectangle.clear();
  rectangle.beginFill(color);
  rectangle.drawRect(0, 0, 50, 400);
  rectangle.endFill();

  let direction = 1;
  const effectDuration = 0.5; // 효과 지속 시간(초)
  const startTime = Date.now(); // 시작 시간

  const animate = () => {
    rectangle.alpha += 0.01 * direction;
    if (rectangle.alpha > 1) {
      rectangle.alpha = 1;
      direction = -1;
    } else if (rectangle.alpha < 0) {
      rectangle.alpha = 0;
      direction = 1;
    }

    // 효과 지속 시간이 지나면 ticker에서 콜백 함수를 제거
    if ((Date.now() - startTime) / 1000 > effectDuration) {
      ticker.remove(animate);  // 수정된 부분

      // 효과가 끝나면 채우기 색상을 다시 검정색으로 변경
      rectangle.clear();
      rectangle.beginFill(0x00c000, 0);
      rectangle.drawRect(0, 0, 50, 400);
      rectangle.endFill();
    }
  };

  // 티커에 애니메이션 함수 추가
  ticker.add(animate);  // 수정된 부분
}

  
  export function performPushEffect(firstRectangle: PIXI.Graphics, secondRectangle: PIXI.Graphics, alpha: number, color: number) {
    firstRectangle.alpha = alpha;
    firstRectangle.clear();
    firstRectangle.beginFill(color);
    firstRectangle.drawRect(0, 0,50, 400);
    firstRectangle.endFill();
    secondRectangle.clear();
    secondRectangle.beginFill(0x00c000, 0);
    secondRectangle.drawRect(0, 0, 50, 400);
    secondRectangle.endFill();
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
    line.drawRect(100, -i * 32 + 588, 410, 32); // 32픽셀 간격으로 높이를 설정
    line.endFill();
  }
}

export function showScore(viewport: Viewport, scoreList: number [], scoreTexts: PIXI.Text[]) {
  
  // 기존에 추가된 PIXI.Text 객체들을 제거
  for (let i = 0; i < scoreTexts.length; i++) {
    if (scoreTexts[i]) {
      viewport.removeChild(scoreTexts[i]);
      //scoreTexts[i] = undefined; // 참조 제거
    }
  }
  
  // scoreTexts 배열 초기화
  scoreTexts = [];
  
  for (let i = 0; i < scoreList.length; i++) {
    let alpha = scoreList[i]/10000;
    let scoreText: PIXI.Text;
    scoreText = new PIXI.Text((alpha * 100).toFixed(2), {fontFamily : 'Arial', fontSize: 20, fill : 0xffffff, align : 'center'}); 
    scoreText.x = 60;
    scoreText.y = 600 - 32*i;
    scoreTexts[i] = scoreText;
    viewport.addChild(scoreText);
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


export function removeGlow(fallingBlock: Tetromino) {
  fallingBlock.graphics.forEach(graphic => {
    if (graphic.filters) {
      // GlowFilter 인스턴스를 찾아 제거
      graphic.filters = graphic.filters.filter(filter => !(filter instanceof GlowFilter));
    }
  });
}
