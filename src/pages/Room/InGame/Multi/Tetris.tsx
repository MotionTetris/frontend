import React, { useEffect, useRef, useState } from "react";
import { TetrisGame } from "../Rapier/TetrisGame.ts";
import { initWorld } from "../Rapier/World.ts";
import { Container, SceneCanvas, VideoContainer, Video, VideoCanvas, CountDown, MessageDiv, SceneContainer, UserNickName, Score, GameOverModal, GameResult, GoLobbyButton, TetrisNextBlockContainer, MultiplayContainer, NextBlockImage, NextBlockText, TextContainer, OtherNickName, CardContainer, Card, OtherScore, ItemImage, DarkBackground, Concentration } from "./style.tsx"
import { createScoreBasedGrid, fallingBlockGlow, removeGlow, showScore, removeGlowWithDelay, fallingBlockGlowWithDelay, explodeBomb, getNextBlockImage, excitingBG, starWarp } from "../Rapier/Effect.ts";
import * as io from 'socket.io-client';
import * as PIXI from "pixi.js";
import "@tensorflow/tfjs";
import { TetrisOption } from "../Rapier/TetrisOption.ts";
import { TetrisMultiplayView } from "../Rapier/TetrisMultiplayView.ts";
import { playGameEndSound } from "../Rapier/Sound/Sound.ts";
import { PoseNet } from "@tensorflow-models/posenet";
import { KeyPointResult, loadPoseNet, processPose } from "../Rapier/PoseNet.ts";
import { createBlockSpawnEvent, createLandingEvent, createUserEventCallback } from "../Rapier/TetrisCallback.ts";
import { BackgroundColor1, Night, ShootingStar } from "@src/BGstyles.ts";
import { jwtDecode } from "jwt-decode";
import { useSelector } from 'react-redux';
import { RootState } from "@app/store";
import { applyItem, getItemUrl, spawnBomb } from "../Rapier/Item.ts";
import { MultiplayEvent, PlayerEventType } from "../Rapier/Multiplay.ts";
import { Timer } from "@src/components/Ingame/Timer.tsx";
import Volume from "@src/components/volume.tsx";
import { StepEvent } from "../Rapier/TetrisEvent.ts";
import { GAME_SOCKET_URL } from "@src/config.ts";
import { useLocation } from "react-router-dom";
import { RoomSocketEvent, roomSocket } from "@src/context/roomSocket.ts";
import { eraseThreshold } from "../Rapier/TetrisContants.ts";
import { changeIngameSoundSpeed } from "@src/components/sound.ts";
import { getToken, getUserNickname } from "@src/data-store/token.ts";

interface TetrisProps {
  isSinglePlay?: boolean;
}

const RAPIER = await import('@dimforge/rapier2d')
const Tetris: React.FC<TetrisProps> = ({ }) => {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const otherSceneRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextBlockRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TetrisGame | null>(null);
  const otherGameRef = useRef<TetrisGame | null>(null);
  const socket = useRef<io.Socket>()
  const otherNicknames = useSelector((state: RootState) => state.game.playersNickname);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('roomId');
  const max = queryParams.get('max');
  const isSinglePlay = max === '1';
  const [message, setMessage] = useState("");
  const [count, setCount] = useState("곧 게임이 시작합니다.");
  const [playerScore, setPlayerScore] = useState(0);
  const [otherScore, setOtherScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nickname, setNickname] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const myLineGrids = Array.from({ length: 21 }, () => {
    const graphics = new PIXI.Graphics();
    graphics.zIndex = 3;  
    return graphics;
  });
  
  const otherLineGrids = Array.from({ length: 21 }, () => {
    const graphics = new PIXI.Graphics();
    graphics.zIndex = 3; 
    return graphics;
  });
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([]);
  const [user, setUser] = useState<string>('')
  const [other, setOther] = useState<string>('')
  const [shuffledCard, setShuffledCard] = useState<JSX.Element[]>([]);
  const concentrationLineRef = useRef<HTMLCanvasElement>(null);
  const warpControllerRef = useRef<{ setWarpSpeed: (newSpeed: number) => void; } | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isCombine, setIsCombine] = useState(false);


  useEffect(() => {
    setNickname(getUserNickname());
  },);
  let bomb: any = undefined;
  useEffect(() => {
    socket.current = io.connect(`${GAME_SOCKET_URL}?roomId=${roomId}&max=${max}`, {
      auth: {
        token: `Bearer ${getToken()}`
      }
    });

    socket.current.on('myName', (nickname: string) => {
      setUser(nickname)
    })

    socket.current.on('userJoined', (nickname: string) => {
      console.log(`${nickname} 님이 입장하셨습니다.`)
    });

    socket.current.on('userLeaved', (nickname: string) => {
      console.log(`${nickname} 님이 입장하셨습니다.`)
      setOther(nickname)
    })

    //30초간격의 아이템고르는 이벤트
    socket.current.on('itemSelectTime', (items: string[]) => {
      gameRef.current!.pause();
      // 형식: "BOMB", "FOG",  "FLIP", "ROTATE_RIGHT", "ROTATE_LEFT",
      const itemImages = items.map(item => {
        let itemUrl = getItemUrl(item);
        return <ItemImage src={itemUrl} />;
      });

      const itemMap = new Map<string, string>();
      itemMap.set("item1", items[0]);
      itemMap.set("item2", items[1]);
      itemMap.set("item3", items[2]);
      setShuffledCard([...itemImages]);

      let cards = document.querySelectorAll('[tabindex]');
      cards.forEach((elem) => {
        (elem as HTMLElement).style.opacity = '1';
      });
      let bg = document.getElementById('card-bg')
      if (bg) {
        bg.style.opacity = '0.75';
      }
      document.getElementById("item2")?.focus();
      setTimeout(async () => {
        cards.forEach((elem) => {
          (elem as HTMLElement).style.opacity = '0';
        });
        const selectedItem = itemMap.get(document.activeElement?.id!);
        console.log("selectedItem:", selectedItem);
        if (bg) {
          bg.style.opacity = '0';
        }
        //폭탄은 eventOn 으로 주고
        // 그외는 'item'으로 준다. 
        if (selectedItem == "BOMB") {
          let event = MultiplayEvent.fromGame(gameRef.current!, user, PlayerEventType.ITEM_USED);
          socket.current!.emit('eventOn', event);
          bomb = await spawnBomb(gameRef.current!, 300, -200);
        }
        else {
          socket.current!.emit('item', selectedItem);
          applyItem(otherGameRef.current!, selectedItem!);
        }
        gameRef.current!.resume();
      }, 5000);
    });

    // 폭탄 이외의 아이템작업.
    socket.current.on('selectedItem', (selectedItem: string) => {
      applyItem(gameRef.current!, selectedItem);
    });

    //모달 띄우기
    socket.current.on('gameEnd', (isEnded: boolean) => {
      setIsGameOver(isEnded);
      playGameEndSound();
      gameRef.current!.pause();
      otherGameRef.current!.pause();
    });

    //남은시간
    socket.current.on('timer', (timeLeft: string) => {
      if (timeLeft == "00:30") {
        changeIngameSoundSpeed(1.25);
        if (warpControllerRef.current) {
          warpControllerRef.current.setWarpSpeed(1);
        }
      }
      setTimeLeft(timeLeft);
    })

    setShootingStars(Array(10).fill(null).map((_, index) => {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`
      };
      return <ShootingStar style={style} key={index} />;
    }));

    warpControllerRef.current = starWarp(concentrationLineRef);


    if (!!!sceneRef.current) {
      console.log("sceneRef is null");
      return;
    }

    if (!isSinglePlay) {
      if (!!!otherSceneRef.current) {
        return;
      }
    }

    if (!nextBlockRef.current) {
      return;
    }

    sceneRef.current.width = 500;
    sceneRef.current.height = 800;
    if (!isSinglePlay) {
      otherSceneRef.current.width = 500;
      otherSceneRef.current.height = 800;
    }

    const CollisionEvent = ({ game, bodyA, bodyB }: any) => {
      let collisionX = bodyA.parent()?.userData.type;
      let collisionY = bodyB.parent()?.userData.type;
      if ((collisionX === 'bomb' || collisionY === 'bomb') &&
        collisionX !== 'ground' && collisionY !== 'ground' &&
        collisionX !== 'left_wall' && collisionY !== 'left_wall' &&
        collisionX !== 'right_wall' && collisionY !== 'right_wall') {
        let ver = (collisionX === 'bomb') ? 0 : 1;
        explodeBomb(game, bodyA, bodyB, ver);
        setPlayerScore((prevScore: number) => prevScore + 10000);
      }
    }


    const CollisionEvent1 = ({ game, bodyA, bodyB }: any) => {
      let collisionX = bodyA.parent()?.userData.type;
      let collisionY = bodyB.parent()?.userData.type;
      if ((collisionX === 'bomb' || collisionY === 'bomb') &&
        collisionX !== 'ground' && collisionY !== 'ground' &&
        collisionX !== 'left_wall' && collisionY !== 'left_wall' &&
        collisionX !== 'right_wall' && collisionY !== 'right_wall') {
        let ver = (collisionX === 'bomb') ? 0 : 1;
        explodeBomb(game, bodyA, bodyB, ver);
        setOtherScore((prevScore: number) => prevScore + 10000);
      }
    }

    const preLandingEvent = ({ game, bodyA, bodyB }: any) => {
      game.fallingTetromino?.rigidBody.resetForces(true);
      removeGlow(game.fallingTetromino);
    }

    const preLandingEvent1 = ({ game, bodyA, bodyB }: any) => {
      game.fallingTetromino?.rigidBody.resetForces(true);
      removeGlow(game.fallingTetromino);
    }

    const LandingEvent = createLandingEvent(eraseThreshold, myLineGrids, setMessage, setPlayerScore, setIsCombine, true, true, socket.current);
    const LandingEvent1 = createLandingEvent(eraseThreshold, otherLineGrids, setMessage, setOtherScore, setIsCombine, false, false);

    const StepCallback = ({ game, currentStep }: StepEvent) => {
      if (currentStep % 15 === 0) {
        const checkResult = game.checkLine(eraseThreshold);
        createScoreBasedGrid(myLineGrids, checkResult.scoreList, eraseThreshold);
        if (!isSinglePlay) {
          const checkOtherResult = otherGame.checkLine(eraseThreshold);
          createScoreBasedGrid(otherLineGrids, checkOtherResult.scoreList, eraseThreshold);
        }
      }

      if (bomb && bomb.lifetime === currentStep) {
        bomb.destroy();
        bomb = undefined;
      }
    }

    const TetrisOption: TetrisOption = {
      blockFriction: 1.0,
      blockSize: 32,
      blockRestitution: 0.0,
      combineDistance: 1,
      view: sceneRef.current,
      spawnX: sceneRef.current.width / 2,
      spawnY: 200,
      worldHeight: 800,
      worldWidth: 600,
      wallColor: "red",
      wallAlpha: 0.1,
      backgroundColor: 0x222929,
      backgroundAlpha: 0
    };

    const OtherTetrisOption: TetrisOption = {
      ...TetrisOption,
      view: otherSceneRef.current,
    };

    const app = new PIXI.Application({
      view: nextBlockRef.current,
      backgroundColor: 0xFFFFFF,
      width: nextBlockRef.current.width,
      height: nextBlockRef.current.height
    });
    app.start();
    const game = new TetrisGame(TetrisOption, "user");
    game.on("collision", CollisionEvent);
    game.on("landing", LandingEvent);
    game.on("prelanding", preLandingEvent);
    game.on("step", StepCallback);
    game.on("blockSpawn", createBlockSpawnEvent(socket.current, app, 48, 150, 40));
    gameRef.current = game;
    game.setWorld(initWorld(RAPIER, TetrisOption));
    let otherGame;
    if (!isSinglePlay) {
      const userId = other;
      otherGame = new TetrisMultiplayView(OtherTetrisOption, userId);
      otherGame.on("collision", CollisionEvent1);
      otherGame.on("landing", LandingEvent1);
      otherGame.on("prelanding", preLandingEvent1);
      otherGame.setWorld(initWorld(RAPIER, OtherTetrisOption));
      otherGameRef.current = otherGame;
    }

    let poseNetResult: { poseNet: PoseNet; renderingContext: CanvasRenderingContext2D; } | undefined = undefined;
    let prevResult: KeyPointResult = {
      leftAngle: 0,
      rightAngle: 0,
      rightWristX: 0,
      leftWristX: 0
    }

    let eventCallback = createUserEventCallback(game, socket.current);
    const poseNetLoop = async () => {
      if (!videoRef.current) {
        return;
      }

      if (!poseNetResult) {

        poseNetResult = await loadPoseNet(videoRef, canvasRef, 776, 668);
      }
      prevResult = await processPose(poseNetResult.poseNet, videoRef.current, poseNetResult.renderingContext, prevResult, eventCallback);
    }

    let id: any;
    const run = async () => {
      const countDown = [5, 4, 3, 2, 1];
      setIsCountingDown(true);

      if (!poseNetResult) {
        poseNetResult = await loadPoseNet(videoRef, canvasRef, 776, 668);
      }
      game.resume();
      for (let i = 0; i < countDown.length; i++) {
        setCount(String(countDown[i]));
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      }
      setCount("게임 시작!");
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      setCount("");

      socket.current?.emit(RoomSocketEvent.EMIT_PLAY_ON, {});

      setIsCountingDown(false);
      if (!isSinglePlay) {
        otherGame.run();
      }


      myLineGrids.forEach((line) => {
        game.graphics.viewport.addChild(line);
      });

      if (!isSinglePlay) {
        otherLineGrids.forEach((line) => {
          otherGame.graphics.viewport.addChild(line);
        });
      }

      await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기

      id = setInterval(poseNetLoop, 250);
      game.spawnBlock("T", "red");
      fallingBlockGlow(game.fallingTetromino!, 0xFF0000);
    }

    socket.current?.on('go', (data: string) => {
      run();
      socket.current?.on('eventOn', (event: any) => {
        otherGame.receiveMultiplayEvent(event);
      });
    });

    return () => {
      game.dispose();
      clearInterval(id);
      socket.current?.disconnect();
    }
  }, []);

  return (<>
    <DarkBackground id='card-bg'></DarkBackground>
    <Volume page="ingame"></Volume>
    <Concentration ref={concentrationLineRef} />
    <Container>
      <CountDown message={count} isCountingDown={isCountingDown}> {count} </CountDown>
      <SceneContainer>
        <SceneCanvas Combine={isCombine} id="game" ref={sceneRef}></SceneCanvas>
        <MessageDiv>  {message} </MessageDiv>
      </SceneContainer>
      <TetrisNextBlockContainer>
        <TextContainer>
          <NextBlockText>NEXT BLOCK</NextBlockText>
        </TextContainer>
        <NextBlockImage><canvas ref={nextBlockRef} /></NextBlockImage>
      </TetrisNextBlockContainer>
      <CardContainer>
        <Card tabIndex={1} id="item1">{shuffledCard[0]}</Card>
        <Card tabIndex={2} id="item2">{shuffledCard[1]}</Card>
        <Card tabIndex={3} id="item3">{shuffledCard[2]}</Card>
      </CardContainer>
      <VideoContainer>
        <UserNickName>{nickname}</UserNickName>
        <Score> Score: {playerScore} </Score>
        <Video ref={videoRef} autoPlay />
        <VideoCanvas ref={canvasRef} />
      </VideoContainer>

      <GameOverModal visible={isGameOver}>
        <GameResult score={playerScore} otherScore={otherScore} />
      </GameOverModal>
      <GoLobbyButton visible={isGameOver} id="go-home" onClick={() => { window.location.href = '/gamemain'; }}>
        로비로 이동하기
      </GoLobbyButton>
      <Timer timeLeft={timeLeft} />

      {!isSinglePlay && (
        <MultiplayContainer>
          <OtherScore> 남의 스코어: {otherScore} </OtherScore>
          <SceneCanvas Combine={false} id="otherGame" ref={otherSceneRef} />
          {Array.from(otherNicknames).map((nickname, index) => (
            <div key={index}>
              <OtherNickName>상대방: {nickname}</OtherNickName>
            </div>
          ))}
        </MultiplayContainer>
      )}
    </Container>
    <BackgroundColor1>
      <Night>
        {shootingStars}
      </Night>
    </BackgroundColor1>

  </>
  );
};

export default Tetris;