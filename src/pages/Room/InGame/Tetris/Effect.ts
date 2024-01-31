import * as PIXI from "pixi.js";
// 폭발 효과 함수
export const explode = (app: PIXI.Application, effect: PIXI.ParticleContainer,x: number, y: number) => {
  // 100개의 입자를 생성
    for (let i = 0; i < 100; i++) {
      // 각 입자는 작은 흰색 사각형으로 표현
        const effectParticle = new PIXI.Sprite(PIXI.Texture.WHITE);
        effectParticle.tint = 0xff0000; // 입자 색상 설정
        effectParticle.width = effectParticle.height = Math.random() * 5 + 5; // 입자 크기 설정

        // 파티클의 위치를 라인의 직사각형 범위 내로 설정
        effectParticle.x = x + Math.random() * 320;
        effectParticle.y = y + Math.random() * 32;

        // 각 입자는 무작위 방향으로 이동
        effectParticle.vx = Math.random() * 5 - 2.5;
        effectParticle.vy = Math.random() * 5 - 2.5;

        // 입자를 ParticleContainer에 추가
        effect.addChild(effectParticle);
    }

  // 입자 이동 함수
    const moveEffectParticles = () => {
        for (let i = effect.children.length - 1; i >= 0; i--) {
            const effectParticle = effect.children[i] as PIXI.Sprite;
            effectParticle.x += effectParticle.vx;
            effectParticle.y += effectParticle.vy;
            effectParticle.alpha -= 0.01;
            effectParticle.scale.x = effectParticle.scale.y += 0.01;

            // 입자가 완전히 투명해지면 ParticleContainer에서 제거
            if (effectParticle.alpha <= 0) {
                effect.removeChild(effectParticle);
            }
        }

        // 모든 입자가 제거되면 ticker에서 이 함수를 제거
        if (effect.children.length === 0) {
            app.ticker.remove(moveEffectParticles);
        }
    };

    app.ticker.add(moveEffectParticles);
};




export function createRectangle(app: PIXI.Application, width: number, height: number, x: number, y: number) {
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x000000);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.x = x;
    rectangle.y = y;
    app.stage.addChild(rectangle);
    return rectangle;
}

