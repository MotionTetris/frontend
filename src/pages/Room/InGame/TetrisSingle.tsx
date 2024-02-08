import React, { useEffect, useRef, useState } from "react";
import { TetrisGame } from "./Rapier/TetrisGame.ts";
import { initWorld } from "./Rapier/World.ts";
import { Container, SceneCanvas, VideoContainer, Video, VideoCanvas, MessageDiv, SceneContainer, UserNickName, Score, MultiplayContainer } from "./style.tsx";
import { collisionParticleEffect, createScoreBasedGrid, explodeParticleEffect, fallingBlockGlow, loadStarImage, removeGlow, showScore, starParticleEffect, startShake, handleComboEffect, performPushEffect, changeBlockGlow} from "./Rapier/Effect.ts";
import * as PIXI from "pixi.js";
import "@tensorflow/tfjs";
import { TetrisOption } from "./Rapier/TetrisOption.ts";
import { playDefeatSound, playExplodeSound, playIngameSound, playLandingSound } from "./Rapier/Sound.ts";
import { PoseNet } from "@tensorflow-models/posenet";
import { KeyPointResult, KeyPointCallback, KeyPoint, loadPoseNet, processPose } from "./Rapier/PostNet.ts";


const eraseThreshold = 8000;
const RAPIER = await import('@dimforge/rapier2d')
const TetrisSingle: React.FC = () => {
  const sceneRef = useRef<HTMLCanvasElement>(null);  //게임화면
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("게임이 곧 시작됩니다");
  const [playerScore, setPlayerScore] = useState(0);
  const scoreTexts = useRef<PIXI.Text[]>([]);
  playIngameSound();

  useEffect(() => {
    
    if (!!!sceneRef.current) {
      console.log("sceneRef is null");
      return;
    }
    
    sceneRef.current.width = 600;
    sceneRef.current.height = 800;
   

    //fallingBlockGlow(game.fallingTetromino!);
    const CollisionEvent = ({game, bodyA, bodyB}: any) => {
    
    }

    const preLandingEvent = ({game, bodyA, bodyB}: any) => {
      game.fallingTetromino?.rigidBody.resetForces(true);
      removeGlow(game.fallingTetromino);
    }
  
    const LandingEvent = ({game, bodyA, bodyB}: any) => {
      let collisionX = (bodyA.translation().x + bodyB.translation().x) / 2;
      let collisionY = (bodyA.translation().y + bodyB.translation().y) / 2;
      playLandingSound();
      if (bodyA.translation().y > 0 && bodyB.translation().y > 0) {
        playDefeatSound();
        setMessage("게임오버");
        game.pause();
        return;
      }
      
      collisionParticleEffect(bodyA.translation().x, -bodyB.translation().y, game.graphics);
      collisionParticleEffect(bodyB.translation().x, -bodyB.translation().y, game.graphics);
      
      const checkResult = game.checkLine(eraseThreshold);
      const scoreList = checkResult.scoreList;
      
      let combo: number = 0;
      let scoreIncrement: number = 0;
      for (let i = 0; i < checkResult.scoreList.length; i++) {
        if (scoreList[i] >= eraseThreshold) {
          combo += 1;
          scoreIncrement += scoreList[i];
        }
      }
    
    
      if (game.removeLines(checkResult.lines)) {
        playExplodeSound();
        setPlayerScore(prevScore => Math.round(prevScore + scoreIncrement * (1 + 0.1 * combo)));
        const comboMessage = handleComboEffect(combo, game.graphics);
        setMessage(comboMessage);
        setTimeout(() => {
          setMessage("");
        }, 1000);
      
        loadStarImage().then((starTexture: PIXI.Texture) => {
          starParticleEffect(0, 600, game.graphics ,starTexture);
          starParticleEffect(450, 600, game.graphics, starTexture);
        }).catch((error: any) => {
          console.error(error);
        });
      }

      game.spawnBlock(0xFF0000, "O", true);
      fallingBlockGlow(game.fallingTetromino!);
    }

    const StepCallback = (game: TetrisGame, step: number) => {
      if (step % 15 != 0) {
        return;
      }
      const checkResult = game.checkLine(eraseThreshold);
      createScoreBasedGrid(game.graphics.viewport, checkResult.scoreList);
      
      scoreTexts.current.forEach((text) => {
        if (game.graphics.viewport.children.includes(text)) {
          game.graphics.viewport.removeChild(text);
        }
      });

      scoreTexts.current = showScore(game.graphics.viewport, checkResult.scoreList, scoreTexts.current, eraseThreshold);
    }

    
    const TetrisOption: TetrisOption = {
      blockFriction: 1.0,
      blockSize: 32,
      blockRestitution: 0.0,
      combineDistance: 1,
      view: sceneRef.current,
      spawnX: sceneRef.current.width / 2,
      spawnY: 200,
      blockCollisionCallback: CollisionEvent,
      blockLandingCallback: LandingEvent,
      preBlockLandingCallback: preLandingEvent,
      stepCallback: StepCallback,
      worldHeight: 800,
      worldWidth: 600,
      wallColor: 0xFF0000,
      wallAlpha: 0.1,
      backgroundColor: 0x222929,
      backgroundAlpha: 1
    };
    
    const game = new TetrisGame(TetrisOption, "user");
    game.setWorld(initWorld(RAPIER, TetrisOption));
    game.running = true;
    game.spawnBlock(0xFF0000, "T", true);
    fallingBlockGlow(game.fallingTetromino!);


    let poseNetResult: { poseNet: PoseNet; renderingContext: CanvasRenderingContext2D; } | undefined = undefined;
    let prevResult: KeyPointResult = {
      leftAngle: 0,
      rightAngle: 0,
      rightWristX: 0,
      leftWristX: 0
    }

    let nextColorIndex = 0;

    let eventCallback: KeyPointCallback = {
      onRotateLeft: function (keypoints: Map<string, KeyPoint>): void {
        nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
        game.onRotateLeft();
      },
      onRotateRight: function (keypoints: Map<string, KeyPoint>): void {
        nextColorIndex = changeBlockGlow(game.fallingTetromino!, nextColorIndex);
        game.onRotateRight();
      },
      onMoveLeft: function (keypoints: Map<string, KeyPoint>): void {
        let centerX = keypoints.get("center")?.x;
        let nose = keypoints.get("nose");
        if (!nose || !centerX) {
          return;
        }
        let alpha = (nose.x - centerX) / 300;
        let forceMagnitude = Math.abs(nose.x - centerX) / (centerX);
        performPushEffect(game.graphics.rectangles[0], game.graphics.rectangles[1],  alpha, 80, 470);
        game.onMoveLeft(forceMagnitude);

      },
      onMoveRight: function (keypoints: Map<string, KeyPoint>): void {
        let centerX = keypoints.get("center")?.x;
        let nose = keypoints.get("nose");
        if (!nose || !centerX) {
          return;
        }
        let alpha = (nose.x - centerX) / 300;
        let forceMagnitude = Math.abs(nose.x - centerX) / (centerX);
        performPushEffect(game.graphics.rectangles[1], game.graphics.rectangles[0], alpha, 470, 80);
        game.onMoveRight(forceMagnitude);
      }
    }
    
    const poseNetLoop = async () => {
      if (!videoRef.current) {
        return;
      }

      if (!poseNetResult) {
        poseNetResult = await loadPoseNet(videoRef, canvasRef);
      }
      prevResult = await processPose(poseNetResult.poseNet, videoRef.current, poseNetResult.renderingContext, prevResult, eventCallback);
    }
    
    let id = setInterval(poseNetLoop, 250);
    game.run(); 

    setMessage("게임 시작!");
    setTimeout(() => {setMessage("")}, 3000); 
  return () => {
    game.dispose();
    clearInterval(id);
  }}, []);

  return (<>
    <Container>
      <SceneContainer>
        <UserNickName> 유저닉: </UserNickName>
        <MessageDiv>  {message} </MessageDiv>
        <Score> 점수: {playerScore} </Score>
        <SceneCanvas id = "game" ref = {sceneRef}> </SceneCanvas>
      </SceneContainer>
    
      <VideoContainer>
        <Video ref={videoRef} autoPlay/>
        <VideoCanvas ref={canvasRef}/>
      </VideoContainer>
    
    </Container>
    </>
  );
};

export default TetrisSingle;