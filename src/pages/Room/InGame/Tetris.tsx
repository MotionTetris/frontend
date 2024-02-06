import React, { useEffect, useRef, useState } from "react";
import { TetrisGame } from "./Rapier/TetrisGame.ts";
import { initWorld } from "./Rapier/World.ts";
import { Container, SceneCanvas, VideoContainer, Video, VideoCanvas, MessageDiv, SceneContainer, UserNickName, Score } from "./style.tsx";
import { collisionParticleEffect, createScoreBasedGrid, explodeParticleEffect, fallingBlockGlow, loadStarImage, removeGlow, showScore, starParticleEffect, startShake } from "./Rapier/Effect.ts";
import * as PIXI from "pixi.js";
import { runPosenet } from "./Rapier/WebcamPosenet.ts";
import "@tensorflow/tfjs";
import { TetrisOption } from "./Rapier/TetrisOption.ts";
import { TetrisMultiplayView } from "./Rapier/TetrisMultiplayView.ts";
import * as io from 'socket.io-client';

const eraseThreshold = 5000;
const RAPIER = await import('@dimforge/rapier2d')
const Tetris: React.FC = () => {
  const sceneRef = useRef<HTMLCanvasElement>(null);  //게임화면
  const otherSceneRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("");
  const socket = useRef<io.Socket>()
  const [playerScore, setPlayerScore] = useState(0);
  const [user, setUser] = useState<string>('')
  const [other, setOther] = useState<string>('')

  useEffect(()=>{ 
    // eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0bWFuIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxODE2MjM5MDIyfQ.Fx5xKjtPQHjYZWTcXkgLBYPL5BXFWELQx-rzAon_5vQ
    const token = localStorage.getItem('token')
    socket.current = io.connect('ws://15.164.166.146:3001?roomId=5',{
      auth:{
        token:`Bearer ${token}`
      }
    });

    socket.current.on('myName',(nickname:string)=>{
      setUser(nickname)
    })

    socket.current.on('userJoined',(nickname:string)=>{
      console.log(nickname,'입장')
    });

    socket.current.on('userLeaved',(nickname:string)=>{
      console.log(nickname,'도망감 ㅋㅋ')
      setOther(nickname)
    })

    return ()=>{
      socket.current?.disconnect();
    }
  },[])



  useEffect(() => {

    if (!!!sceneRef.current) {
      console.log("sceneRef is null");
      return;
    }
    if (!!!otherSceneRef.current) {
      console.log("sceneRef is null");
      return;
    }
    sceneRef.current.width = 600;
    sceneRef.current.height = 800;

    otherSceneRef.current.width = 600;
    otherSceneRef.current.height = 800;

    const createLandingEvent = (game: TetrisGame, isView: boolean) => {
      return ({bodyA, bodyB}: any) => {
        let collisionX = (bodyA.translation().x + bodyB.translation().x) / 2;
        let collisionY = (bodyA.translation().y + bodyB.translation().y) / 2;
        if (bodyA.translation().y > -400 || bodyB.translation().y > -400) {
          setMessage("게임오버")
          game.pause();
          if (isView) {
            socket.current?.emit('gameOver',true)
          }
          return // 잘림 동기화 : 상대가 오버 당해도 내 화면에서 상대 블럭이 잘리는 현상 방지.
        }
        
        //collisionParticleEffect(collisionX, -collisionY, game.graphics.viewport, game.graphics.renderer);
        collisionParticleEffect(bodyA.translation().x, -bodyB.translation().y, game.graphics.viewport, game.graphics.renderer);
        collisionParticleEffect(bodyB.translation().x, -bodyB.translation().y, game.graphics.viewport, game.graphics.renderer);
        const checkResult = game.checkLine(5000);
        // for (let i = 0; i < checkResult.lineIndices.length; i++) {
        //   explodeParticleEffect(game.graphics.viewport, game.graphics.scene, 140, checkResult.lineIndices[i]);
        // }
        game.removeLines(checkResult.lines);
        game.spawnBlock(0xFF0000, "O", true);
      }
    }



    let scoreTexts: PIXI.Text[] = [];
    //fallingBlockGlow(game.fallingTetromino!);
    const CollisionEvent = ({game, bodyA, bodyB}: any) => {
      
    }

    const CollisionEvent1 = ({otherGame, bodyA, bodyB}: any) => {

    }

    const preLandingEvent = ({game, bodyA, bodyB}: any) => {
      game.fallingTetromino?.rigidBody.resetForces(true);
      removeGlow(game.fallingTetromino);
    }

    const preLandingEvent1 = ({otherGame, bodyA, bodyB}: any) => {
      game.fallingTetromino?.rigidBody.resetForces(true);
    }

    const LandingEvent = ({game, bodyA, bodyB}: any) => {
      let collisionX = (bodyA.translation().x + bodyB.translation().x) / 2;
      let collisionY = (bodyA.translation().y + bodyB.translation().y) / 2;
      
      if (bodyA.translation().y > 0 && bodyB.translation().y > 0) {
        setMessage("게임오버")
        game.pause();
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
     
      if (game.removeLines(checkResult.lines)) {
        startShake({ viewport: game.graphics.viewport, strength: 15, duration: 500 });
        loadStarImage().then((starTexture: PIXI.Texture) => {
          starParticleEffect(0, 600, game.graphics.viewport, starTexture);
          starParticleEffect(450, 600, game.graphics.viewport, starTexture);
        }).catch((error: any) => {
          console.error(error);
        });
      }

      //make lineGrids score
      createScoreBasedGrid(game.graphics.viewport, checkResult.scoreList);
    
      //showScore(game.graphics.viewport, checkResult.scoreList, scoreTexts);
      game.spawnBlock(0xFF0000, "O", true);
      fallingBlockGlow(game.fallingTetromino!);
    }


    const LandingEvent1 = ({otherGame, bodyA, bodyB}: any) => {
      let collisionX = (bodyA.translation().x + bodyB.translation().x) / 2;
      let collisionY = (bodyA.translation().y + bodyB.translation().y) / 2;
      
      if (bodyA.translation().y > 0 && bodyB.translation().y > 0) {
        setMessage("게임오버")
        otherGame.pause();
        return;
      }
      const checkResult = otherGame.checkLine(eraseThreshold);
      otherGame.removeLines(checkResult.lines)
      otherGame.spawnBlock(0xFF0000, "O", true);
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

    // const otherGameOption = {
    //   blockFriction: 1.0,
    //   blockSize: 32,
    //   blockRestitution: 0.0,
    //   combineDistance: 1,
    //   view: otherSceneRef.current,
    //   spawnX: otherSceneRef.current.width / 2,
    //   spawnY: 200,
    //   blockCollisionCallback: CollisionEvent1,
    //   blockLandingCallback: LandingEvent1,
    //   preBlockLandingCallback: preLandingEvent1,
    //   worldHeight: 800,
    //   worldWidth: 600
    // };

    // const userId = other;
    // const otherGame = new TetrisMultiplayView(otherGameOption, userId);
    // otherGame.running = false;
    // otherGame.setWorld(initWorld(RAPIER, otherGameOption));
    // otherGame.spawnBlock(0xFF0000, "S", true);

    runPosenet(videoRef, canvasRef, game, socket.current);
    // socket.current?.on('eventOn',(event:any)=>{
    //   otherGame.receiveKeyFrameEvent(event)
    // })
    socket.current?.on('gameStart',(data:string)=>{
      console.log(data)
      game.run(); 
      // otherGame.run();
    })
    game.run(); 
  return () => {
    game.dispose();
  }}, []);

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

      <SceneCanvas id="otherGame" ref={otherSceneRef}> </SceneCanvas>
    </Container>
  );
};

export default Tetris;