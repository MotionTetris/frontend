// src/components/Room1.tsx
import React, { useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, Body } from "matter-js";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import TetrisGame, {
  BlockCollisionCallbackParam,
} from "./Tetris/TetrisGame";
import * as PIXI from "pixi.js";
import Matter from "matter-js";
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import {RoomContainer,StartButton, ReadyButton,PlayerBackground, TetrisBackButton, TetrisCanvas, TetrisNextBlock, TetrisPlayer, TetrisScore, PlayerNickName,PlayerProficture,  MotionContainer, Motion, MotionDot} from '../styles';
import {  Container,
  SceneCanvas,
  MessageDiv,
  ScoreDiv,
  NextBlockContainer,
  NextBlockText,
  NextBlockImage,
  VideoContainer,
  Video,
  VideoCanvas,
  GameContainer,
  EffectCanvas,} from './Ingamestyles';
  import {gsap} from 'gsap';
  import { BlockTypeList, BlockColorList } from "./Tetris/BlockCreator";
  import { blockImages } from "./Tetris/BlockCreator";
  import { explode, createRectangle, performRotateEffect, performPushEffect } from "./Tetris/Effect";
  import { setupWebcam, calculateAngle } from "./Tetris/WebcamPosenet";
import { getUserProfileAndRoomData } from '@api/room';
import { RoomAPIResponse, UserProfile, RoomData, GameRoomProps } from '../../../types/room';
// CPU 백엔드로 강제 설정

let nBTI: number; // 다음 블록 타입
let nFSI: number; // 다음 블록 색상



const GameRoom: React.FC<GameRoomProps> = ({ userId }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleStartButtonClick = () => {
    // TODO: 사용자 숫자를 확인하고 조건을 검사합니다.
    // 조건이 충족되면 Ingame 페이지로 이동합니다.
    // 예: history.push('/ingame');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfileData: UserProfile = await getUserProfileAndRoomData(userId);
        setUserProfile(userProfileData);
        console.log("API 호출 결과:", userProfileData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [userId]);


  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const blockRef = useRef<Body | null>(null); // 블록 참조 저장
  const hasCollidedRef = useRef(false);
  const [message, setMessage] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [nextBlockTypeIdx, setNextBlockTypeIdx] = useState(0);
  const [nextFillStyleIdx, setNextFillStyleIdx] = useState(0);

  // 엔진 생성
  const engine = Engine.create({
    // 중력 설정
    gravity: {
      x: 0,
      y: 0.043,
    },
  });

  useEffect(() => {
    async function runPosenet() {
      const net = await posenet.load();
      const video = await setupWebcam(videoRef);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      video.width = 480;
      video.height = 320;
      canvas!.width = 480;
      canvas!.height = 320;
      // 각도와 손목의 위치를 저장할 변수 선언
      let leftAngleInDegrees = 0;
      let prevLeftAngle = 0;
      let leftWristX = 0;
      let prevLeftWristX = 0;

      let rightAngleInDegrees = 0;
      let prevRightAngle = 0;
      let rightWristX = 0;
      let prevRightWristX = 0;

      let leftAngleDelta = 0;
      let rightAngleDelta = 0;

      let noseX = 0;

      setInterval(async () => {
        const pose = await net.estimateSinglePose(video, {
          flipHorizontal: true,
        });
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          pose.keypoints.forEach((keypoint) => {
            if (
              keypoint.score >= 0.5 &&
              [
                "leftShoulder",
                "rightShoulder",
                "leftElbow",
                "rightElbow",
                "leftWrist",
                "rightWrist",
              ].includes(keypoint.part)
            ) {
              ctx.beginPath();
              ctx.arc(
                keypoint.position.x,
                keypoint.position.y,
                5,
                0,
                2 * Math.PI
              );
              ctx.fillStyle = "red";
              ctx.fill();
            } else if (keypoint.part === "nose") {
              ctx.beginPath();
              ctx.arc(
                keypoint.position.x,
                keypoint.position.y,
                10,
                0,
                2 * Math.PI
              );
              ctx.fillStyle = "blue";
              ctx.fill();
            }
          });
          //모션인식 키고싶으면 !block으로 할것
          if (!GAME.fallingBlock || hasCollidedRef.current) {
            return;
          }
          let leftShoulderKeypoint = pose.keypoints.find(
            (keypoint) => keypoint.part === "leftShoulder"
          );
          let leftElbowKeypoint = pose.keypoints.find(
            (keypoint) => keypoint.part === "leftElbow"
          );
          let leftWristKeypoint = pose.keypoints.find(
            (keypoint) => keypoint.part === "leftWrist"
          );
          // 각 요소가 존재하는지 확인하고, 존재한다면 위치 정보를 가져옵니다.
          let leftShoulder = leftShoulderKeypoint
            ? leftShoulderKeypoint.position
            : null;
          let leftElbow = leftElbowKeypoint ? leftElbowKeypoint.position : null;
          let leftWrist = leftWristKeypoint ? leftWristKeypoint.position : null;
          let leftShoulderScore = leftShoulderKeypoint ? leftShoulderKeypoint.score : Infinity;
          let leftElbowScore = leftElbowKeypoint ? leftElbowKeypoint.score : Infinity;
          let leftWristScore = leftWristKeypoint ? leftWristKeypoint.score : Infinity;

          let leftMinScore = Math.min(leftShoulderScore, leftElbowScore, leftWristScore);
          
          
          if (leftMinScore > 0.25 && leftShoulder && leftElbow && leftWrist) {
            leftAngleInDegrees  = calculateAngle(leftShoulder, leftElbow, leftWrist);
            leftWristX = leftWrist.x;
            leftAngleDelta = leftAngleInDegrees - prevLeftAngle;
          }

          let rightShoulderKeypoint = pose.keypoints.find(
            (keypoint: any) => keypoint.part === "rightShoulder"
          );
          let rightElbowKeypoint = pose.keypoints.find(
            (keypoint: any) => keypoint.part === "rightElbow"
          );
          let rightWristKeypoint = pose.keypoints.find(
            (keypoint: any) => keypoint.part === "rightWrist"
          );

          // 각 요소가 존재하는지 확인하고, 존재한다면 위치 정보를 가져옵니다.
          let rightShoulder = rightShoulderKeypoint
            ? rightShoulderKeypoint.position
            : null;
          let rightElbow = rightElbowKeypoint
            ? rightElbowKeypoint.position
            : null;
          let rightWrist = rightWristKeypoint
            ? rightWristKeypoint.position
            : null;
          
          
          let rightShoulderScore = rightShoulderKeypoint ? rightShoulderKeypoint.score : Infinity;
          let rightElbowScore = rightElbowKeypoint ? rightElbowKeypoint.score : Infinity;
          let rightWristScore = rightWristKeypoint ? rightWristKeypoint.score : Infinity;
            
          let rightMinScore = Math.min(rightShoulderScore, rightElbowScore, rightWristScore);
          
          if (rightMinScore > 0.25 && rightShoulder && rightElbow && rightWrist) {
          rightAngleInDegrees = calculateAngle(rightShoulder, rightElbow, rightWrist);

            rightWristX = rightWrist.x;
            // 각도의 변화값. (이전 각도와의 차이)
            rightAngleDelta = rightAngleInDegrees - prevRightAngle;
          }

          if (leftAngleDelta > rightAngleDelta) {
            if (
              leftAngleDelta > 35 &&
              leftAngleInDegrees > prevLeftAngle &&
              leftWristX < prevLeftWristX - 20
            ) {
              if (GAME.fallingBlock) {
                // block이 존재하는지 확인
                Body.rotate(GAME.fallingBlock, -Math.PI / 4); // 45도 회전
                performRotateEffect(rectangleLeftRotate, pixiApp, 0xff0000);
              }
            }
          } else {
            if (
              rightAngleDelta > 35 &&
              rightAngleInDegrees > prevRightAngle &&
              rightWristX - 20 > prevRightWristX
            ) {
              if (GAME.fallingBlock) {
                // block이 존재하는지 확인
                Body.rotate(GAME.fallingBlock, Math.PI / 4); // 45도 회전
                performRotateEffect(rectangleRightRotate, pixiApp, 0xff0000);
              }
            }
          }

          let noseKeypoint = pose.keypoints.find(
            (keypoint) => keypoint.part === "nose"
          );

          // 각 요소가 존재하는지 확인하고, 존재한다면 위치 정보를 가져옵니다.
          let noseX = noseKeypoint ? noseKeypoint.position.x : null;

          let centerX = videoRef.current
            ? videoRef.current.offsetWidth / 2
            : null;

          if (noseX && centerX) {
            let forceMagnitude = Math.abs(noseX - centerX) / (centerX * 100); // 중앙에서 얼마나 떨어져 있는지에 비례하는 힘의 크기를 계산합니다.
            forceMagnitude = Math.min(forceMagnitude, 1); // 힘의 크기가 너무 커지지 않도록 1로 제한합니다.

            // noseX와 centerX의 차이에 따라 alpha 값을 결정
            let alpha = Math.min(Math.abs(noseX - centerX) / 300, 1); // 100은 정규화를 위한 값이며 조절 가능

            if (GAME.fallingBlock) {
              if (noseX < centerX) {
                // 코의 x 좌표가 캔버스 중앙보다 왼쪽에 있다면, 블록에 왼쪽으로 힘을 가합니다.
                Body.applyForce(GAME.fallingBlock, GAME.fallingBlock.position, {
                  x: -forceMagnitude,
                  y: 0,
                });
                performPushEffect(rectangleLeft, rectangleRight,  alpha, 0x00ff00);
              } else {
                // 코의 x 좌표가 캔버스 중앙보다 오른쪽에 있다면, 블록에 오른쪽으로 힘을 가합니다.
                Body.applyForce(GAME.fallingBlock, GAME.fallingBlock.position, {
                  x: forceMagnitude,
                  y: 0,
                });
                performPushEffect(rectangleRight, rectangleLeft, alpha, 0x00ff00);
              }
            }
          }

          prevLeftAngle = leftAngleInDegrees;
          prevRightAngle = rightAngleInDegrees;
          prevRightWristX = rightWristX;
          prevLeftWristX = leftWristX;
        }
      }, 250);
    }
    runPosenet();

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
    console.log(`the first next info is ${nextInfo.nextBlockTypeIdx} , ${nextInfo.nextFillStyleIdx}`);
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
    const particleGraphics = new PIXI.Graphics();
    particleGraphics.beginFill(0xffb6c1);
    particleGraphics.drawCircle(0, 0, 5);
    particleGraphics.endFill();
    const texture = pixiApp.renderer.generateTexture(particleGraphics);

    const explosionTexture = PIXI.Texture.from("../src/assets/explosion.png");
    const flash = new PIXI.Sprite(explosionTexture);


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
    for (let i = 0; i < 20; i++) {
      let line = new PIXI.Graphics();
      line.lineStyle(1, 0xFFF000, 0.2); // 선의 두께는 1, 색상은 검정색, 투명도는 1(불투명)
      line.beginFill(0x000000, 0); 
      line.drawRect(140, i * 32, 320, 32); // 32픽셀 간격으로 높이를 설정
      line.endFill();
      lines.push(line); // lines 배열에 추가
      pixiApp.stage.addChild(line); // stage에 추가
    }

    // 엔진 업데이트
    pixiApp.ticker.add(() => {
      Engine.update(engine, 1000 / 60);
    });

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
          kill += 1;
          // 특정 위치에서 폭발 효과 발생
          explode(pixiApp, particleEffect, 140, i*32);
          // 스프라이트 초기화
          flash.alpha = 1; // 알파값 초기화
          if (flash.parent) { // 스프라이트가 이미 부모에 추가되어 있으면 제거
            flash.parent.removeChild(flash);
          }

          // 스프라이트 위치 설정 및 추가
          flash.x = 140;
          flash.y = i*32 -200;
          flash.alpha = 0.5;
          pixiApp.stage.addChild(flash);

          // 애니메이션 생성
          let ticker = PIXI.Ticker.shared;
          let timeElapsed = 0; // 경과 시간
          const handleTick = (deltaTime: number) => {
            timeElapsed += deltaTime;
            if (timeElapsed >= 60) { // 약 1초 후
              ticker.remove(handleTick); // 애니메이션 제거
              if (flash.parent) { // 스프라이트가 부모에 추가되어 있다면 제거
                flash.parent.removeChild(flash);
              }
            }
          };
          ticker.add(handleTick);
                  

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
      
      for (let i = 0; i < 30; i++) {
        
        let collisionPoint;
        if (bodyA.label == "Rectangle Body") {
          collisionPoint = bodyA;
        } else {
          collisionPoint = bodyB;
        }

        const particle = new PIXI.Sprite(texture); // 파티클 이미지

        particle.position.set(
          collisionPoint.position.x,
          collisionPoint.position.y
        ); // 파티클 위치

        particle.speed = Math.random() * 5; // 파티클 속도
        particle.direction = Math.random() * Math.PI * 2; // 파티클 방향
        particle.alpha = 1; // 파티클 초기 투명도
        pixiApp.stage.addChild(particle);

        // 파티클 움직임과 소멸
        let ticker = new PIXI.Ticker();
        ticker.add(() => {
          particle.x += Math.cos(particle.direction) * particle.speed;
          particle.y += Math.sin(particle.direction) * particle.speed;
          particle.alpha -= 0.01; // 점차 투명도 감소
          if (particle.alpha <= 0) {
            // 투명도가 0이 되면 파티클 제거
            pixiApp.stage.removeChild(particle);
            ticker.stop();
          }
        });
        ticker.start();
      }
      
      GAME.spawnNewBlock(nBTI,nFSI);
      nBTI = Math.floor(Math.random() * BlockTypeList.length);
      nFSI = Math.floor(Math.random() * BlockColorList.length);
      setNextBlockTypeIdx(nBTI);
      setNextFillStyleIdx(nFSI);
    }
    return () => {
      // 클린업 함수
      // 엔진 정지
      Engine.clear(engine);
      // 렌더러 정지
      // Runner 정지
      Runner.stop(runner);
      // setInterval 제거
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

export default GameRoom;