import React, { useEffect, useRef, useState } from "react";
import { TetrisGame } from "./Rapier/TetrisGame.ts";
import { initWorld } from "./Rapier/World.ts";
import { Container, SceneCanvas, VideoContainer, Video, VideoCanvas, MessageDiv, SceneContainer, UserNickName, Score, MultiplayContainer, PlayerContainer } from "./style.tsx";
import { changeBlockGlow, collisionParticleEffect, createScoreBasedGrid, explodeParticleEffect, fallingBlockGlow, loadStarImage, performPushEffect, removeGlow, showScore, starParticleEffect, startShake } from "./Rapier/Effect.ts";
import * as PIXI from "pixi.js";
import "@tensorflow/tfjs";
import { TetrisOption } from "./Rapier/TetrisOption.ts";
import { TetrisMultiplayView } from "./Rapier/TetrisMultiplayView.ts";
import * as io from 'socket.io-client';
import  {useLocation} from "react-router-dom"
import { GAME_SOCKET_URL } from "../../../config.ts";
import {  useSelector } from 'react-redux';
import { RootState } from "@app/store.ts";
import { KeyPoint, KeyPointCallback, KeyPointResult, loadPoseNet, processPose } from "./Rapier/PostNet.ts";
import { PoseNet } from "@tensorflow-models/posenet";
import { createLandingEvent, createUserEventCallback } from "./Rapier/TetrisCallback.ts";

const eraseThreshold = 10000;
const RAPIER = await import('@dimforge/rapier2d')
const Tetris: React.FC = () => {
  const sceneRef = useRef<HTMLCanvasElement>(null);  //게임화면
  const otherSceneRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("게임이 곧 시작됩니다");
  const socket = useRef<io.Socket>()
  const [playerScore, setPlayerScore] = useState(0);
  const scoreTexts = useRef<PIXI.Text[]>([]);
  const [user, setUser] = useState<string>('')
  const [other, setOther] = useState<string>('')
  const location = useLocation();
  const currentPlayerNickname = useSelector((state: RootState) => state.homepage.nickname);
  const [otherPlayers, setOtherPlayers] = useState<string[]>([]);  
  const otherNicknames = useSelector((state: RootState) => state.game.playersNickname);
  console.log("딴놈 닉", Array.from(otherNicknames));


  useEffect(()=>{ 
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('roomId')
    const max = queryParams.get('max')
    const token = localStorage.getItem('token')

    socket.current = io.connect(`${GAME_SOCKET_URL}?roomId=${roomId}&max=${max}`,{
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

    //fallingBlockGlow(game.fallingTetromino!);
    const CollisionEvent = ({game, bodyA, bodyB}: any) => {
    
    }

    const CollisionEvent1 = ({game, bodyA, bodyB}: any) => {

    }

    const preLandingEvent = ({game, bodyA, bodyB}: any) => {
      game.fallingTetromino?.rigidBody.resetForces(true);
      removeGlow(game.fallingTetromino);
    }

    const preLandingEvent1 = ({game, bodyA, bodyB}: any) => {
      game.fallingTetromino?.rigidBody.resetForces(true);
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

    const LandingEvent = createLandingEvent(eraseThreshold, setMessage, setPlayerScore);

    const LandingEvent1 = ({game, bodyA, bodyB}: any) => {
      let collisionX = (bodyA.translation().x + bodyB.translation().x) / 2;
      let collisionY = (bodyA.translation().y + bodyB.translation().y) / 2;
      
      if (bodyA.translation().y > 0 && bodyB.translation().y > 0) {
        setMessage("게임오버")
        game.pause();
        return;
      }
      const checkResult = game.checkLine(eraseThreshold);
      game.removeLines(checkResult.lines)
      game.spawnBlock(0xFF0000, "O", true);
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
      backgroundAlpha: 1,
      stepCallback: StepCallback
    };
    
    const game = new TetrisGame(TetrisOption, "user");
    game.setWorld(initWorld(RAPIER, TetrisOption));
    game.running = true;
    game.spawnBlock(0xFF0000, "T", true);
    fallingBlockGlow(game.fallingTetromino!);

    const otherGameOption = {
      blockFriction: 1.0,
      blockSize: 32,
      blockRestitution: 0.0,
      combineDistance: 1,
      view: otherSceneRef.current,
      spawnX: otherSceneRef.current.width / 2,
      spawnY: 200,
      blockCollisionCallback: CollisionEvent1,
      blockLandingCallback: LandingEvent1,
      preBlockLandingCallback: preLandingEvent1,
      worldHeight: 800,
      worldWidth: 600,
      wallColor: 0xFF0000,
      wallAlpha: 0.1,
      backgroundColor: 0x222929,
      backgroundAlpha: 1
    };

    const userId = other;
    const otherGame = new TetrisMultiplayView(otherGameOption, userId);
    otherGame.running = false;
    otherGame.setWorld(initWorld(RAPIER, otherGameOption));
    otherGame.spawnBlock(0xFF0000, "T", true);

    // runPosenet(videoRef, canvasRef, game, socket.current);
    let poseNetResult: { poseNet: PoseNet; renderingContext: CanvasRenderingContext2D; } | undefined = undefined;
    let prevResult: KeyPointResult = {
      leftAngle: 0,
      rightAngle: 0,
      rightWristX: 0,
      leftWristX: 0
    }

    const eventCallback = createUserEventCallback(game, socket.current);
    const poseNetLoop = async () => {
      if (!videoRef.current) {
        return;
      }

      if (!poseNetResult) {
        poseNetResult = await loadPoseNet(videoRef, canvasRef);
      }
      prevResult = await processPose(poseNetResult.poseNet, videoRef.current, poseNetResult.renderingContext, prevResult, eventCallback);
    }

    setInterval(poseNetLoop, 250);

    socket.current?.on('go',(data:string)=>{
      console.log("시작!");
      otherGame.run();
      game.run(); 
      setMessage("게임 시작!");
      setTimeout(() => {
        setMessage("");
      }, 3000); 
      socket.current?.on('eventOn',(event:any)=>{
        otherGame.receiveKeyFrameEvent(event)
      });
    })
    
    
    //game.run(); 
  return () => {
    game.dispose();
    otherGame.dispose();

  }}, []);

  return (<>
    <Container>

      
      <PlayerContainer>
        <SceneContainer>
          <UserNickName> 유저닉: {currentPlayerNickname} </UserNickName>
          <MessageDiv>  {message} </MessageDiv>
          <Score> 점수: {playerScore} </Score>
          <SceneCanvas id = "game" ref = {sceneRef}> </SceneCanvas>
        </SceneContainer>
      
    
      <VideoContainer>
        <Video ref={videoRef} autoPlay/>
        <VideoCanvas ref={canvasRef}/>
      </VideoContainer>
      </PlayerContainer>

              <MultiplayContainer>
        <SceneCanvas id="otherGame" ref={otherSceneRef} />
        {Array.from(otherNicknames).map((nickname, index) => (
          <div key={index}>
            <UserNickName>유저닉: {nickname}</UserNickName>
          </div>
        ))}
      </MultiplayContainer>
    </Container>
    </>
  );
};

export default Tetris;