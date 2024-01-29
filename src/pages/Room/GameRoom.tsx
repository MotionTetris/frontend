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
import {RoomContainer,PlayerStatus, TetrisLogo, TetrisCanvas, TetrisNextBlock, TetrisPlayer, TetrisScore, TetrisSingle, MotionContainer, Motion, MotionDot} from './styles';

// CPU 백엔드로 강제 설정

const GameRoom: React.FC = () => {
  const playerData = useSelector((state: RootState) => state.game.player)


const line = [
  [
    [100, 490],
    [500, 490],
    [100, 550],
    [500, 550],
  ],
];

let playerScore = 0;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const blockRef = useRef<Body | null>(null); // 블록 참조 저장
  const hasCollidedRef = useRef(false);
  const [message, setMessage] = useState("");

  // 엔진 생성
  const engine = Engine.create({
    // 중력 설정
    gravity: {
      x: 0,
      y: 0.043,
    },
  });

  useEffect(() => {
    async function setupWebcam() {
      console.log('웹캠 설정을 시작합니다...');
      const video = document.createElement("video");
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        return new Promise<HTMLVideoElement>((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            resolve(videoRef.current!);
          };
        });
      }
      return video;
    }

    async function runPosenet() {
      const net = await posenet.load();
      const video = await setupWebcam();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

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
        console.log(`ctx, canvas = ${ctx}, ${canvas}`);
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
          console.log("1")
          //모션인식 키고싶으면 !block으로 할것
          if (!GAME.fallingBlock || hasCollidedRef.current) {
            return;
          }
          console.log("2")
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

          if (leftShoulder && leftElbow && leftWrist) {
            let vectorA = {
              x: leftShoulder.x - leftElbow.x,
              y: leftShoulder.y - leftElbow.y,
            };
            let vectorB = {
              x: leftWrist.x - leftElbow.x,
              y: leftWrist.y - leftElbow.y,
            };

            let leftDotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
            let leftMagnitudeA = Math.sqrt(
              vectorA.x * vectorA.x + vectorA.y * vectorA.y
            );
            let leftMagnitudeB = Math.sqrt(
              vectorB.x * vectorB.x + vectorB.y * vectorB.y
            );

            let leftAngleInRadians = Math.acos(
              leftDotProduct / (leftMagnitudeA * leftMagnitudeB)
            );
            leftAngleInDegrees = leftAngleInRadians * (180 / Math.PI);

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

          if (rightShoulder && rightElbow && rightWrist) {
            let vectorA = {
              x: rightShoulder.x - rightElbow.x,
              y: rightShoulder.y - rightElbow.y,
            };
            let vectorB = {
              x: rightWrist.x - rightElbow.x,
              y: rightWrist.y - rightElbow.y,
            };

            let rightDotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
            let rightMagnitudeA = Math.sqrt(
              vectorA.x * vectorA.x + vectorA.y * vectorA.y
            );
            let rightMagnitudeB = Math.sqrt(
              vectorB.x * vectorB.x + vectorB.y * vectorB.y
            );

            let rightAngleInRadians = Math.acos(
              rightDotProduct / (rightMagnitudeA * rightMagnitudeB)
            );
            rightAngleInDegrees = rightAngleInRadians * (180 / Math.PI);

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

                // 효과 시작 시 채우기 색상을 빨간색으로 변경
                rectangleLeftRotate.clear();
                rectangleLeftRotate.beginFill(0xff0000);
                rectangleLeftRotate.drawRect(0, 0, 50, 400);
                rectangleLeftRotate.endFill();

                let direction = 1;
                const effectDuration = 0.5; // 효과 지속 시간(초)
                const startTime = Date.now(); // 시작 시간

                const animate = () => {
                    rectangleLeftRotate.alpha += 0.01 * direction;
                    if (rectangleLeftRotate.alpha > 1) {
                        rectangleLeftRotate.alpha = 1;
                        direction = -1;
                    } else if (rectangleLeftRotate.alpha < 0) {
                        rectangleLeftRotate.alpha = 0;
                        direction = 1;
                    }

                    // 효과 지속 시간이 지나면 ticker에서 콜백 함수를 제거
                    if ((Date.now() - startTime) / 1000 > effectDuration) {
                        pixiApp.ticker.remove(animate);

                        // 효과가 끝나면 채우기 색상을 다시 검정색으로 변경
                        rectangleLeftRotate.clear();
                        rectangleLeftRotate.beginFill(0x000000);
                        rectangleLeftRotate.drawRect(0, 0, 50, 400);
                        rectangleLeftRotate.endFill();
                    }
                };

                pixiApp.ticker.add(animate);
                setMessage("왼쪽으로 회전!"); // 메시지를 변경합니다.
                setTimeout(() => setMessage(""), 500);
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
                 // 효과 시작 시 채우기 색상을 빨간색으로 변경
                rectangleRightRotate.clear();
                rectangleRightRotate.beginFill(0xff0000);
                rectangleRightRotate.drawRect(0, 0, 50, 400);
                rectangleRightRotate.endFill();

                let direction = 1;
                const effectDuration = 0.5; // 효과 지속 시간(초)
                const startTime = Date.now(); // 시작 시간

                const animate = () => {
                    rectangleRightRotate.alpha += 0.01 * direction;
                    if (rectangleRightRotate.alpha > 1) {
                        rectangleRightRotate.alpha = 1;
                        direction = -1;
                    } else if (rectangleRightRotate.alpha < 0) {
                        rectangleRightRotate.alpha = 0;
                        direction = 1;
                    }

                    // 효과 지속 시간이 지나면 ticker에서 콜백 함수를 제거
                    if ((Date.now() - startTime) / 1000 > effectDuration) {
                        pixiApp.ticker.remove(animate);

                        // 효과가 끝나면 채우기 색상을 다시 검정색으로 변경
                        rectangleRightRotate.clear();
                        rectangleRightRotate.beginFill(0x000000);
                        rectangleRightRotate.drawRect(0, 0, 50, 400);
                        rectangleRightRotate.endFill();
                    }
                };

                pixiApp.ticker.add(animate);
                setMessage("오른쪽으로 회전!");
                setTimeout(() => setMessage(""), 500);
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
            let alpha = Math.min(Math.abs(noseX - centerX) / 300, 1);  // 100은 정규화를 위한 값이며 조절 가능

            if (GAME.fallingBlock) {
              if (noseX < centerX) {
                // 코의 x 좌표가 캔버스 중앙보다 왼쪽에 있다면, 블록에 왼쪽으로 힘을 가합니다.
                Body.applyForce(GAME.fallingBlock, GAME.fallingBlock.position, {
                  x: -forceMagnitude,
                  y: 0,
                });
                 // 왼쪽 직사각형 색상 변경
                rectangleLeft.alpha = alpha;
                rectangleLeft.clear();
                rectangleLeft.beginFill(0x00ff00);
                rectangleLeft.drawRect(0, 0, 50, 400);
                rectangleLeft.endFill();

                // 오른쪽 직사각형 색상 원래대로
                rectangleRight.clear();
                rectangleRight.beginFill(0x000000);
                rectangleRight.drawRect(0, 0, 50, 400);
                rectangleRight.endFill();

              } else {
                // 코의 x 좌표가 캔버스 중앙보다 오른쪽에 있다면, 블록에 오른쪽으로 힘을 가합니다.
                Body.applyForce(GAME.fallingBlock, GAME.fallingBlock.position, {
                  x: forceMagnitude,
                  y: 0,
                });
                
                // 오른쪽 직사각형 색상 변경
                rectangleRight.alpha = alpha;
                rectangleRight.clear();
                rectangleRight.beginFill(0x00ff00);
                rectangleRight.drawRect(0, 0, 50, 400);
                rectangleRight.endFill();

                // 왼쪽 직사각형 색상 원래대로
                rectangleLeft.clear();
                rectangleLeft.beginFill(0x000000);
                rectangleLeft.drawRect(0, 0, 50, 400);
                rectangleLeft.endFill();
              }
            }
          }

          prevLeftAngle = leftAngleInDegrees;
          prevRightAngle = rightAngleInDegrees;
          prevRightWristX = rightWristX;
          prevLeftWristX = leftWristX;

          console.log(leftAngleDelta);
        }
      }, 250);
    }
    runPosenet();

    if (!sceneRef.current) return;

    // 렌더러 시작

    let container = document.createElement("div");
    container.style = "position: relative; width: 600px; height: 800px";
    document.body.appendChild(container);
    const render = Matter.Render.create({
      element: container, // DOM element to render the canvas (document.body means it will be appended to the body)
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
      blockFriction: 1.0,
      blockRestitution: 0.0,
      blockSize: 32,
      blockLandingCallback: block,
      view: render.canvas,
      spawnY: -100,
    });
    GAME.spawnNewBlock();
    // 엔진 실행
    render.canvas.style = "position: absolute";
    container.appendChild(render.canvas);

    // pixi
    const pixiApp = new PIXI.Application({
      width: 600,
      height: 800,
      backgroundAlpha: 0, // 배경색 투명하게 설정
    });

    // @ts-ignore
    pixiApp.view.style = "position: absolute;";
    container.appendChild(pixiApp.view);
    // 파티클 생성을 위한 그래픽스 객체
    const particleGraphics = new PIXI.Graphics();
    particleGraphics.beginFill(0xffb6c1);
    particleGraphics.drawCircle(0, 0, 5);
    particleGraphics.endFill();
    const texture = pixiApp.renderer.generateTexture(particleGraphics);


    const rectangleRight = new PIXI.Graphics();
    rectangleRight.beginFill(0x000000); // 초록색으로 채움
    rectangleRight.drawRect(0, 0, 50, 400); // 너비 50, 높이 800의 사각형
    rectangleRight.endFill();

    // 사각형의 위치를 렌더러의 오른쪽에 위치하도록 설정
    rectangleRight.x = pixiApp.screen.width - rectangleRight.width;
    rectangleRight.y = 0;

    // 사각형을 stage에 추가
    pixiApp.stage.addChild(rectangleRight);




    // 왼쪽 사각형 그래픽 생성
    const rectangleLeft = new PIXI.Graphics();
    rectangleLeft.beginFill(0x000000); // 초기 채우기 색상을 검정색으로 설정
    rectangleLeft.drawRect(0, 0, 50, 400); // 너비 50, 높이 800의 사각형
    rectangleLeft.endFill();

    // 사각형의 위치를 렌더러의 왼쪽에 위치하도록 설정
    rectangleLeft.x = 0;
    rectangleLeft.y = 0;

    // 사각형을 stage에 추가
    pixiApp.stage.addChild(rectangleLeft);

    // 하단 오른쪽 사각형 그래픽 생성
    const rectangleRightRotate = new PIXI.Graphics();
    rectangleRightRotate.beginFill(0x000000); // 초록색으로 채움
    rectangleRightRotate.drawRect(0, 0, 50, 400); // 너비 50, 높이 400의 사각형
    rectangleRightRotate.endFill();

    // 사각형의 위치를 렌더러의 오른쪽, 하단에 위치하도록 설정
    rectangleRightRotate.x = pixiApp.screen.width - rectangleRightRotate.width;
    rectangleRightRotate.y = 400;

    // 사각형을 stage에 추가
    pixiApp.stage.addChild(rectangleRightRotate);

    // 하단 왼쪽 사각형 그래픽 생성
    const rectangleLeftRotate = new PIXI.Graphics();
    rectangleLeftRotate.beginFill(0x000000); // 초록색으로 채움
    rectangleLeftRotate.drawRect(0, 0, 50, 400); // 너비 50, 높이 400의 사각형
    rectangleLeftRotate.endFill();

    // 사각형의 위치를 렌더러의 왼쪽, 하단에 위치하도록 설정
    rectangleLeftRotate.x = 0;
    rectangleLeftRotate.y = 400;

    // 사각형을 stage에 추가
    pixiApp.stage.addChild(rectangleLeftRotate);





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
      console.log("ㅋㅋ", bodyA.position.y, bodyB.position.y);
      if (bodyB.position.y < 10 || bodyA.position.y < 10) {
        return;
      }
      GAME.checkAndRemoveLines(GAME.appropriateScore);

      Body.setVelocity(bodyA, { x: 0, y: 0 });
      Body.setVelocity(bodyB, { x: 0, y: 0 });
      Body.setAngularSpeed(bodyA, 0);
      Body.setAngularSpeed(bodyB, 0);
      Body.setSpeed(bodyA, 0);
      Body.setSpeed(bodyB, 0);
      Body.setStatic(bodyA, true);
      Body.setStatic(bodyB, true);
      console.log(bodyA, bodyB, "오");
      for (let i = 0; i < 40; i++) {
        console.log(`body a is ${bodyA.label}`)
        let collisionPoint;
        if (bodyA.label == 'Rectangle Body') {
          collisionPoint = bodyA;
        }
        else {
          collisionPoint = bodyB;
        }

        
        const particle = new PIXI.Sprite(texture); // 파티클 이미지
        
        particle.position.set(collisionPoint.position.x, collisionPoint.position.y); // 파티클 위치
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
      GAME.spawnNewBlock();
    }
    return () => {
      console.log("제거");
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
    <RoomContainer>
        <TetrisLogo>Logo Here</TetrisLogo>
        <TetrisSingle>Single Play</TetrisSingle>
        <TetrisPlayer>Player Info</TetrisPlayer>
        <TetrisNextBlock>Next Block Info</TetrisNextBlock>
       <TetrisCanvas ref={sceneRef}>Tetris here</TetrisCanvas>
        <TetrisScore>Score Info :{playerData.score}</TetrisScore>
        <MotionContainer>
          <Motion ref={videoRef} >Motion Show</Motion>
          <MotionDot ref={canvasRef}>Dot here</MotionDot>
        </MotionContainer>
        <PlayerStatus>Ready Button</PlayerStatus>
    </RoomContainer>
  );
};

export default GameRoom;