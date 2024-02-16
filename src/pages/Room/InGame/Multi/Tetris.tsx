import React, { useEffect, useRef, useState } from "react";
import { TetrisGame } from "../Rapier/TetrisGame.ts";
import { initWorld } from "../Rapier/World.ts";
import { Container, SceneCanvas, VideoContainer, Video, VideoCanvas, MessageDiv, SceneContainer, UserNickName, Score, GameOverModal, GameResult, GoLobbyButton, TetrisNextBlockContainer, MultiplayContainer, NextBlockImage, NextBlockText, TextContainer, OtherNickName, CardContainer, Card, OtherScore, ItemImage, DarkBackground, } from "./style.tsx"
import { createScoreBasedGrid, fallingBlockGlow, removeGlow, showScore, removeGlowWithDelay, fallingBlockGlowWithDelay, explodeBomb, getNextBlockImage } from "../Rapier/Effect.ts";
import * as io from 'socket.io-client';
import * as PIXI from "pixi.js";
import "@tensorflow/tfjs";
import { TetrisOption } from "../Rapier/TetrisOption.ts";
import { TetrisMultiplayView } from "../Rapier/TetrisMultiplayView.ts";
import { playGameEndSound } from "../Rapier/Sound.ts";
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


const eraseThreshold = 8000;
const RAPIER = await import('@dimforge/rapier2d')
const Tetris: React.FC = () => {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const otherSceneRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TetrisGame | null>(null);
  const otherGameRef = useRef<TetrisGame | null>(null);
  const socket = useRef<io.Socket>()
  const otherNicknames = useSelector((state: RootState) => state.game.playersNickname);
  const [nextBlock, setNextBlock] = useState("");
  const [message, setMessage] = useState("게임이 곧 시작됩니다");
  const [playerScore, setPlayerScore] = useState(0);
  const [otherScore, setOtherScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nickname, setNickname] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const scoreTexts = useRef(
    Array.from({ length: 21 }, () => new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 24, fill: '#ffffff' }))
  );

  const otherScoreTexts = useRef(
    Array.from({ length: 21 }, () => new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 24, fill: '#ffffff' }))
  );

  const myLineGrids = Array.from({ length: 21 }, () => new PIXI.Graphics());
  const otherLineGrids = Array.from({ length: 21 }, () => new PIXI.Graphics());
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([]);
  const [user, setUser] = useState<string>('')
  const [other, setOther] = useState<string>('')
  const [shuffledCard, setShuffledCard] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const nickname = decoded.sub || "";
      setNickname(nickname);
    }
  },);
  let bomb: any = undefined;
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('roomId')
    const max = queryParams.get('max')
    const token = localStorage.getItem('token')

    socket.current = io.connect(`${GAME_SOCKET_URL}?roomId=${roomId}&max=${max}`, {
      auth: {
        token: `Bearer ${token}`
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
      setTimeout(() => {
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
          bomb = spawnBomb(gameRef.current!, 300, -200);
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

    if (!!!sceneRef.current) {
      console.log("sceneRef is null");
      return;
    }

    if (!!!otherSceneRef.current) {
      return;
    }

    sceneRef.current.width = 500;
    sceneRef.current.height = 900;
    otherSceneRef.current.width = 500;
    otherSceneRef.current.height = 900;
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

    const LandingEvent = createLandingEvent(eraseThreshold, myLineGrids, setMessage, setPlayerScore, true, true, socket.current);
    const LandingEvent1 = createLandingEvent(eraseThreshold, otherLineGrids, setMessage, setOtherScore, false, false);

    const StepCallback = ({ game, currentStep }: StepEvent) => {
      if (currentStep % 15 === 0) {
        const checkResult = game.checkLine(eraseThreshold);
        const checkOtherResult = otherGame.checkLine(eraseThreshold);
        createScoreBasedGrid(myLineGrids, checkResult.scoreList, eraseThreshold);
        createScoreBasedGrid(otherLineGrids, checkOtherResult.scoreList, eraseThreshold);
        showScore(checkResult.scoreList, scoreTexts.current, eraseThreshold);
        showScore(checkOtherResult.scoreList, otherScoreTexts.current, eraseThreshold);
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
    const game = new TetrisGame(TetrisOption, "user");
    game.on("collision", CollisionEvent);
    game.on("landing", LandingEvent);
    game.on("prelanding", preLandingEvent);
    game.on("step", StepCallback);
    game.on("blockSpawn", createBlockSpawnEvent(socket.current, setNextBlock));
    gameRef.current = game;
    game.setWorld(initWorld(RAPIER, TetrisOption));

    const userId = other;
    const otherGame = new TetrisMultiplayView(OtherTetrisOption, userId);
    otherGame.on("collision", CollisionEvent1);
    otherGame.on("landing", LandingEvent1);
    otherGame.on("prelanding", preLandingEvent1);
    otherGame.setWorld(initWorld(RAPIER, OtherTetrisOption));
    otherGameRef.current = otherGame;

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
        poseNetResult = await loadPoseNet(videoRef, canvasRef);
      }
      prevResult = await processPose(poseNetResult.poseNet, videoRef.current, poseNetResult.renderingContext, prevResult, eventCallback);
    }

    let id: any;
    const run = async () => {
      if (!poseNetResult) {
        poseNetResult = await loadPoseNet(videoRef, canvasRef);
      }
      game.resume();
      otherGame.run();
      setMessage("게임 시작!");
      scoreTexts.current.forEach((text) => {
        game.graphics.viewport.addChild(text);
      });

      otherScoreTexts.current.forEach((text) => {
        otherGame.graphics.viewport.addChild(text);
      })

      myLineGrids.forEach((line) => {
        game.graphics.viewport.addChild(line);
      });

      otherLineGrids.forEach((line) => {
        otherGame.graphics.viewport.addChild(line);
      });


      setTimeout(() => { setMessage("") }, 3000);
      id = setInterval(poseNetLoop, 250);
      game.spawnBlock("T", "red");
      fallingBlockGlow(game.fallingTetromino!, 0xFF0000);
    }

    socket.current?.on('go', (data: string) => {
      run();
      console.log("Go!");
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
    <Container>
      <SceneContainer>
        <MessageDiv>  {message} </MessageDiv>
        <SceneCanvas id="game" ref={sceneRef}></SceneCanvas>
      </SceneContainer>
      <TetrisNextBlockContainer>
        <TextContainer>
          <NextBlockText>NEXT BLOCK</NextBlockText>
        </TextContainer>
        <NextBlockImage><img src={getNextBlockImage(nextBlock)} /></NextBlockImage>
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

      <MultiplayContainer>
        <OtherScore> 남의 스코어: {otherScore} </OtherScore>
        <SceneCanvas id="otherGame" ref={otherSceneRef} />
        {Array.from(otherNicknames).map((nickname, index) => (
          <div key={index}>
            <OtherNickName>상대방: {nickname}</OtherNickName>
          </div>
        ))}
      </MultiplayContainer>
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