// src/components/Room1.tsx
import React, { useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, Body } from "matter-js";
import "@tensorflow/tfjs";
import TetrisGame, {
  BlockCollisionCallbackParam,
} from "./Tetris/TetrisGame";
import * as PIXI from "pixi.js";
import Matter from "matter-js";
import {  Container,SceneCanvas,MessageDiv,ScoreDiv,NextBlockContainer,NextBlockText,NextBlockImage,
  VideoContainer,Video,VideoCanvas,GameContainer,EffectCanvas} from './styles';
  import {gsap} from 'gsap';
  import { BlockTypeList, BlockColorList } from "./Tetris/BlockCreator";
  import { blockImages } from "./Tetris/BlockCreator";
  import { explodeParticleEffect,explodeImageEffect, generateParticleTexture, collisionParticleEffect, createRectangle, performRotateEffect, performPushEffect, createLineEffect } from "./Tetris/Effect";
  import {runPosenet} from "./Tetris/WebcamPosenet";
// CPU 백엔드로 강제 설정

let nBTI: number; // 다음 블록 타입
let nFSI: number; // 다음 블록 색상

const Ingame: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const blockRef = useRef<Body | null>(null); // 블록 참조 저장
  const hasCollidedRef = useRef(false);
  const [message, setMessage] = useState("게임이 곧 시작됩니다.");
  const [timeLeft, setTimeLeft] = useState(6); // 남은 시간을 상태로 관리합니다.
  const [playerScore, setPlayerScore] = useState(0);
  const [nextBlockTypeIdx, setNextBlockTypeIdx] = useState(0);
  const [nextFillStyleIdx, setNextFillStyleIdx] = useState(0);

   // 엔진 설정
  const engine = Engine.create({
    gravity: {
      x: 0,
      y: 0,
    },
  });

  // 중력 y 값을 0으로 설정하는 함수
  const upGravity = () => {
    engine.gravity.y = 0.043;
  };
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      upGravity();
    }, 6000); // 5초 후에 stopGravity 함수를 호출
  
    // 컴포넌트가 언마운트될 때 인터벌을 정리
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if(timeLeft > 0) { // 남은 시간이 있을 때만 카운트다운을 진행합니다.
      const intervalId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1); // 1초씩 감소
        setMessage(`게임이 ${timeLeft - 1}초 후에 시작됩니다.`); // 남은 시간을 메시지로 표시
      }, 1000);

      // 컴포넌트가 언마운트될 때 인터벌을 정리
      return () => clearInterval(intervalId);
    } else {
      setMessage("게임 시작!");
    }
  }, [timeLeft]); // timeLeft가 변경될 때마다 useEffect를 실행

  useEffect(() => {
    if (!sceneRef.current) return;
    // 렌더러 시작
    const gameView = document.getElementById("game-view");

    // 렌더러 시작
    const render = Matter.Render.create({
      canvas: gameView, // DOM element to render the canvas (document.body means it will be appended to the body)
      engine: engine, // Reference to the Matter.js engine
      options: {
        width: 600, // Width of the canvas
        height: 800, // Height of the canvas
        wireframes: false, // Set to true for wireframe rendering
      },
    });
    const runner = Runner.create();
    const GAME = new TetrisGame({
      combineDistance: 1,
      engine: engine,
      runner: runner,
      blockFriction: 0,
      blockRestitution: 0,
      blockSize: 32,
      blockLandingCallback: block,
      view: render.canvas,
      spawnY: -100,
    });
    const firstBlock = Math.floor(Math.random() * BlockTypeList.length);
    const firstStyle = Math.floor(Math.random() * BlockColorList.length);
    const nextInfo = GAME.spawnFirstBlock(firstBlock, firstStyle);
    nBTI = nextInfo.nextBlockTypeIdx;
    nFSI = nextInfo.nextFillStyleIdx;
    setNextBlockTypeIdx(nBTI);
    setNextFillStyleIdx(nFSI);
    
    // pixi
    const effectView = document.getElementById("game-effect-view");
    const pixiApp = new PIXI.Application({
      width: 600,
      height: 800,
      backgroundAlpha: 0, // 배경색 투명하게 설정
      view: effectView,
    });

    // 블록 떨어지는 효과
    const collisionTexture = generateParticleTexture(pixiApp);
    // 블록 폭발 이미지 텍스쳐
    const explosionTexture = PIXI.Texture.from("../src/assets/explosion.png");
    const explosionSprite = new PIXI.Sprite(explosionTexture);

    // explosion 효과 
    const particleEffect = new PIXI.ParticleContainer(100, { alpha: true, scale: true });
    // ParticleContainer를 stage에 추가
    pixiApp.stage.addChild(particleEffect);
    // 좌우밀기, 좌우회전 이펙트객체
    const rectangleLeft = createRectangle(pixiApp, 50, 400, 0,0 )
    const rectangleRight = createRectangle(pixiApp, 50, 400, pixiApp.screen.width - 50, 0);
    const rectangleRightRotate = createRectangle(pixiApp, 50, 400, pixiApp.screen.width - 50, 400);
    const rectangleLeftRotate = createRectangle(pixiApp, 50, 400, 0, 400);
    
    let lines: PIXI.Graphics[] = [];
    let scoreTexts: PIXI.Text[] = [];
    // 라인 격자 이펙트 객체
    for (let i =0 ; i < 20; i ++) {
      createLineEffect(i, pixiApp, lines);
    }
    
    // 엔진 업데이트
    pixiApp.ticker.add(() => {
      Engine.update(engine, 1000 / 60);
    });

    runPosenet(videoRef, canvasRef, hasCollidedRef, pixiApp, GAME, rectangleLeft, rectangleRight, rectangleLeftRotate, rectangleRightRotate);
    Runner.run(runner, engine);
    render.canvas.tabIndex = 1;
    const event = (event: any) => GAME.onKeyboardEvent(event);
    render.canvas.addEventListener("keydown", event);
    render.canvas.focus();
    Matter.Render.run(render);
    function block({ bodyA, bodyB }: BlockCollisionCallbackParam) {
      
      if (bodyB.position.y < 10 || bodyA.position.y < 10) {
        setMessage("게임종료")
        return;
      }
      GAME.checkAndRemoveLines();
      const scoreList = GAME.scoreList;
      let kill = 0;
      for (let i = 0; i < lines.length; i++) {
        const alpha = scoreList[i]; // 점수를 투명도로 변환 (0 ~ 1 사이의 값)
        let line = lines[i];
        line.clear(); // 이전 라인 스타일 제거
        line.beginFill(0x808080, alpha/1.5); 
        line.drawRect(140, i * 32, 320, 32); // 32픽셀 간격으로 높이를 설정
        line.endFill();

        // 이전에 생성된 텍스트 객체가 있다면 제거
        if (scoreTexts[i]) {
          pixiApp.stage.removeChild(scoreTexts[i]);
        }

        let scoreText: PIXI.Text;

        // 새로운 텍스트 객체 생성
        if (alpha * 100 < 95 && alpha * 100 >= 0) {
          scoreText = new PIXI.Text((alpha * 100).toFixed(2), {fontFamily : 'Arial', fontSize: 20, fill : 0xffffff, align : 'center'});
          scoreText.x = 80;
          scoreText.y = i * 32;
        }
        else if (alpha * 100 < 100) {
          scoreText = new PIXI.Text("폭파직전!", {fontFamily : 'Arial', fontSize: 20, fill : 0xfff000, align : 'center'});
          scoreText.x = 80;
          scoreText.y = i * 32;
          // 반짝이는 효과 추가
          gsap.to(scoreText, { duration: 0.5, alpha: 0, yoyo: true, repeat: -1 });
        }
        
        else  {
          // const exaudio = new Audio(explodeSound);
          // exaudio.play().catch(error => console.log('재생 오류:', error));
          kill += 1;
          // 특정 위치에서 폭발 파티클 효과 발생
          explodeParticleEffect(pixiApp, particleEffect, 140, i*32);
          // 폭발 이미지 효과 발생
          explodeImageEffect(explosionSprite, pixiApp, i);

          setPlayerScore((prevPlayerScore) => {
            const newScore = prevPlayerScore + Math.floor(alpha * 3000);
            return newScore;
          });
          
          scoreText = new PIXI.Text("폭파!", {fontFamily : 'Arial', fontSize: 20, fill : 0xff0000, align : 'center'});
          scoreText.x = 80;
          scoreText.y = i * 32;
          // 확대 효과 추가
          // 글자 크기를 크게 했다가 작게 하는 효과 추가
          gsap.to(scoreText.scale, { 
            duration: 1, 
            x: 2, 
            y: 2, 
            yoyo: true, 
            repeat: 1, 
            onComplete: () => {
              gsap.to(scoreText.scale, { duration: 0, x: 1, y: 1 });
              return;
            },
          });

          // 1초 후에 라인 스타일을 원래대로 되돌림
          setTimeout(() => {
            line.clear();
            line.beginFill(0x808080, alpha/1.5); // 원래 색상으로 변경
            line.drawRect(140, i * 32, 320, 32);
            line.endFill();
          }, 1000); // 1초 후에 실행

        }

        // 새로 생성한 텍스트 객체를 배열에 저장
        scoreTexts[i] = scoreText;
        pixiApp.stage.addChild(scoreText); // stage에 텍스트 추가
      }
      const gameMessage = ["single", "double", "triple", "quadra"];
    
      if (kill == 1) {
        setMessage(gameMessage[0]+  " explosion!");
        setTimeout(() => setMessage(""), 2000);
      } else if (kill == 2) {
        setMessage(gameMessage[1]+  " explosion!");
        setTimeout(() => setMessage(""), 2000);
      } else if (kill == 3) {
        setMessage(gameMessage[2]+  " explosion!");
        setTimeout(() => setMessage(""), 2000);
      } else if (kill == 4) {
        setMessage(gameMessage[3]+  " explosion!");
        setTimeout(() => setMessage(""), 2000);
      }
      
      Body.setVelocity(bodyA, { x: 0, y: 0 });
      Body.setVelocity(bodyB, { x: 0, y: 0 });
      Body.setAngularSpeed(bodyA, 0);
      Body.setAngularSpeed(bodyB, 0);
      Body.setSpeed(bodyA, 0);
      Body.setSpeed(bodyB, 0);
      Body.setStatic(bodyA, true);
      Body.setStatic(bodyB, true);
      collisionParticleEffect(bodyA, bodyB, collisionTexture, pixiApp);

      GAME.spawnNewBlock(nBTI,nFSI);
      nBTI = Math.floor(Math.random() * BlockTypeList.length);
      nFSI = Math.floor(Math.random() * BlockColorList.length);
      setNextBlockTypeIdx(nBTI);
      setNextFillStyleIdx(nFSI);
    }
    return () => {
      Engine.clear(engine);
      Runner.stop(runner);
      GAME.dispose();
      render.canvas.removeEventListener("keydown", event);
    };
  }, []);

  return (
    <Container>
      <ScoreDiv>score: {playerScore}</ScoreDiv>
      <MessageDiv>{message}</MessageDiv>
      <NextBlockContainer>
        <NextBlockText>next</NextBlockText>
        <NextBlockImage src={blockImages[nextBlockTypeIdx]} alt="next block" />
      </NextBlockContainer>
      <GameContainer>
        <SceneCanvas id="game-view" ref={sceneRef}>
        </SceneCanvas>
        <EffectCanvas id="game-effect-view"></EffectCanvas>
      </GameContainer>
      <VideoContainer>
        <Video ref={videoRef} autoPlay />
        <VideoCanvas ref={canvasRef} />
      </VideoContainer>
    </Container>
  );
};

export default Ingame;