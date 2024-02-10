import { RefObject } from 'react';
import * as posenet from "@tensorflow-models/posenet";
import * as PIXI from "pixi.js";
import { changeBlockGlow, performPushEffect } from './Effect';
import { TetrisGame } from './TetrisGame';
import { Graphics } from './Graphics';
import { math } from '@tensorflow/tfjs';
import { socketConnected } from '@redux/socket/socketActions';
import { Socket } from 'socket.io-client';



// webcam.ts

export async function setupWebcam(videoRef: RefObject<HTMLVideoElement>) {
    console.log("웹캠 설정을 시작합니다...");
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

export async function runPosenet(videoRef: RefObject<HTMLVideoElement>, canvasRef: RefObject<HTMLCanvasElement>,
    game: TetrisGame, socket?: Socket) {
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
    let nextColorIndex = 0;
    game.graphics.ticker.start();
    //const [rectangleLeft, rectangleRight, rectangleLeftRotate, rectangleRightRotate] = rectangles;

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
            console.log("왼회전")
            
            nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
            const event = game.onRotateLeft();
            socket?.emit('eventOn',event);
          
          }
        } else {
          if (
            rightAngleDelta > 35 &&
            rightAngleInDegrees > prevRightAngle &&
            rightWristX - 20 > prevRightWristX
          ) {
            console.log("우회전")
            nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
            const event = game.onRotateRight();
            socket?.emit('eventOn', event);
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
          let forceMagnitude = Math.abs(noseX - centerX) / (centerX); // 중앙에서 얼마나 떨어져 있는지에 비례하는 힘의 크기를 계산합니다.

          let alpha = (noseX - centerX) / 300; // 100은 정규화를 위한 값이며 조절 가능

            if (noseX < centerX) {
              performPushEffect(game.graphics.rectangles[0], game.graphics.rectangles[1],  alpha, 80, 470);
              const event = game.onMoveLeft(forceMagnitude);
              socket?.emit('eventOn',event);
              
            } else {
              performPushEffect(game.graphics.rectangles[1], game.graphics.rectangles[0], alpha, 470, 80);
              const event = game.onMoveRight(forceMagnitude);
              socket?.emit('eventOn',event);
            }
        }

        prevLeftAngle = leftAngleInDegrees;
        prevRightAngle = rightAngleInDegrees;
        prevRightWristX = rightWristX;
        prevLeftWristX = leftWristX;
      }
    }, 250);
  }


interface Point {
    x: number;
    y: number;
}

export function calculateAngle(pointA: Point, pointB: Point, pointC: Point): number {
    let vectorA = {
        x: pointA.x - pointB.x,
        y: pointA.y - pointB.y,
    };
    let vectorB = {
        x: pointC.x - pointB.x,
        y: pointC.y - pointB.y,
    };

    let dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    let magnitudeA = Math.sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y);
    let magnitudeB = Math.sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y);

    let angleInRadians = Math.acos(dotProduct / (magnitudeA * magnitudeB));
    let angleInDegrees = angleInRadians * (180 / Math.PI);
    
    return angleInDegrees;
}