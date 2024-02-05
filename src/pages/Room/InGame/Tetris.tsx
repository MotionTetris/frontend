import React, { useEffect, useRef, useState } from "react";
import { TetrisGame } from "./Rapier/TetrisGame.ts";
import { initWorld } from "./Rapier/World.ts";
import { calculatePosition, removeLines } from "./Rapier/BlockRemove.ts";
import { Container, SceneCanvas, VideoContainer, Video, VideoCanvas, MessageDiv, SceneContainer, UserNickName, Score } from "./style.tsx";
import { collisionParticleEffect, createScoreBasedGrid, explodeParticleEffect, fallingBlockGlow, removeGlow, showScore, starParticleEffect, startShake } from "./Rapier/Effect.ts";
import * as PIXI from "pixi.js";
import { runPosenet } from "./Rapier/WebcamPosenet.ts";
import "@tensorflow/tfjs";


const eraseThreshold = 5000;
const RAPIER = await import('@dimforge/rapier2d')
const Tetris: React.FC = () => {
  const sceneRef = useRef<HTMLCanvasElement>(null);  //게임화면
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  useEffect(() => {

    if (!!!sceneRef.current) {
      console.log("sceneRef is null");
      return;
    }
    
    sceneRef.current.width = 600;
    sceneRef.current.height = 800;

    let scoreTexts: PIXI.Text[] = [];
    //fallingBlockGlow(game.fallingTetromino!);
    const CollisionEvent = ({bodyA, bodyB}: any) => {
      
    }

    const LandingEvent = ({bodyA, bodyB}: any) => {
      let collisionX = (bodyA.translation().x + bodyB.translation().x) / 2;
      let collisionY = (bodyA.translation().y + bodyB.translation().y) / 2;
      
      if (bodyA.translation().y > 0 && bodyB.translation().y > 0) {
        setMessage("게임오버")
        game.stop();
        return;
      }
      
      collisionParticleEffect(bodyA.translation().x, -bodyB.translation().y, game.graphics.viewport, game.graphics.renderer);
      collisionParticleEffect(bodyB.translation().x, -bodyB.translation().y, game.graphics.viewport, game.graphics.renderer);
      
      const checkResult = game.checkLine(eraseThreshold);
      const scoreList = checkResult.scoreList;
      for (let i = 0; i < checkResult.scoreList.length; i++) {
        if (scoreList[i] >= eraseThreshold) {
          setPlayerScore(prevScore => Math.round(prevScore + scoreList[i]));
        }
      }
      // for (let i = 0; i < checkResult.lineIndices.length; i++) {
      //   explodeParticleEffect(140, -checkResult.lineIndices[i]*32 + 600, game.graphics.viewport);
      // }
      if (game.removeLines(checkResult.lines)) {
        startShake({ viewport: game.graphics.viewport, strength: 10, duration: 500 });
        starParticleEffect(0, 600, game.graphics.viewport );
        starParticleEffect(550, 600, game.graphics.viewport );
      }

      //make lineGrids score
      createScoreBasedGrid(game.graphics.viewport, checkResult.scoreList);
      
    
      //showScore(game.graphics.viewport, checkResult.scoreList, scoreTexts);
      game.spawnBlock(0xFF0000, "O", true);
      fallingBlockGlow(game.fallingTetromino!);
    }

    const game = new TetrisGame({
      blockFriction: 1.0,
      blockSize: 32,
      blockRestitution: 0.0,
      combineDistance: 1,
      view: sceneRef.current,
      spawnX: sceneRef.current.width / 2,
      spawnY: 200,
      blockCollisionCallback: CollisionEvent,
      blockLandingCallback: LandingEvent
    }, false);

    game.setWorld(initWorld(RAPIER, {
      blockFriction: 1.0,
      blockSize: 32,
      blockRestitution: 0.0,
      combineDistance: 1,
      view: sceneRef.current,
      spawnX: sceneRef.current.width / 2,
      spawnY: 200,
      blockCollisionCallback: CollisionEvent,
      blockLandingCallback: LandingEvent
    }));
    
    runPosenet(videoRef, canvasRef, game);
    game.running = true;
    game.run();
    game.spawnBlock(0xFF0000, "T", true);
    fallingBlockGlow(game.fallingTetromino!);
  return () => {}}, []);

  return (
    <Container>
      <SceneContainer>
        <UserNickName> 유저닉: </UserNickName>
        <MessageDiv> 게임이 곧 시작됩니다. {message} </MessageDiv>
        <Score> 점수: {playerScore} </Score>
        <SceneCanvas id = "game" ref = {sceneRef}> </SceneCanvas>
      </SceneContainer>
    
      <VideoContainer>
        <Video ref={videoRef} autoPlay/>
        <VideoCanvas ref={canvasRef}/>
      </VideoContainer>
    </Container>
  );
};

export default Tetris;