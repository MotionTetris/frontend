import React, { useEffect, useRef, useState } from "react";
import { TetrisGame } from "../Rapier/TetrisGame.ts";
import { initWorld } from "../Rapier/World.ts";
import { Container, SceneCanvas, VideoContainer, Video, VideoCanvas, MessageDiv, SceneContainer, UserNickName, Score, GameOverModal, UserBackGround, GameResult, GoLobbyButton, RotateRightButton, RotateLeftButton, BombButton, FlipButton, FogButton, ResetFlipButton, ResetRotationButton, ButtonContainer, TetrisNextBlockContainer, TextContainer, NextBlockText, NextBlockImage, ModalOverlay, StyledTutorial, } from "./style.tsx";
import { createScoreBasedGrid, fallingBlockGlow, removeGlow, showScore, removeGlowWithDelay, fallingBlockGlowWithDelay, explodeBomb, getNextBlockImage } from "../Rapier/Effect.ts";
import { rotateViewport, resetRotateViewport, spawnBomb, flipViewport, resetFlipViewport, addFog, getRandomItem, } from "../Rapier/Item.ts";
import * as PIXI from "pixi.js";
import "@tensorflow/tfjs";
import { TetrisOption } from "../Rapier/TetrisOption";
import { playDefeatSound, playExplodeSound, playLandingSound } from "../Rapier/Sound";
import { PoseNet } from "@tensorflow-models/posenet";
import { KeyPointResult, KeyPointCallback, KeyPoint, loadPoseNet, processPose } from "../Rapier/PoseNet.ts";
import { createBlockSpawnEvent, createLandingEvent, createUserEventCallback } from "../Rapier/TetrisCallback";
import { BackgroundColor1, Night, ShootingStar } from "@src/BGstyles.ts";
import { jwtDecode } from "jwt-decode";
import { BOMB_URL, FOG_URL, FLIP_URL, ROTATE_LEFT_URL, ROTATE_RIGHT_URL } from "@src/config"
import Tutorial from "@src/components/Tutorial/tutorial.tsx";
import Volume from "@src/components/volume.tsx";

const eraseThreshold = 8000;
const RAPIER = await import('@dimforge/rapier2d')
const TetrisSingle: React.FC = () => {
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([]);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nextBlock, setNextBlock] = useState("");
  const [item, setItem] = useState("");
  const [message, setMessage] = useState("게임이 곧 시작됩니다");
  const [playerScore, setPlayerScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameRef = useRef<TetrisGame | null>(null);
  const [nickname, setNickname] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const scoreTexts = useRef(
    Array.from({ length: 21 }, () => new PIXI.Text('0', { fontFamily: 'Arial', fontSize: 24, fill: '#ffffff' }))
  );
  const lineGrids = Array.from({ length: 21 }, () => new PIXI.Graphics());


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const nickname = decoded.sub || "";
      setNickname(nickname);
    }
  },);





  useEffect(() => {
    if (!isModalOpen) {
      setShootingStars(Array(20).fill(null).map((_, index) => {
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

      sceneRef.current.width = 600;
      sceneRef.current.height = 800;
      const CollisionEvent = ({ game, bodyA, bodyB }: any) => {

        let collisionX = bodyA.parent()?.userData.type;
        let collisionY = bodyB.parent()?.userData.type;

        if ((collisionX === 'bomb' || collisionY === 'bomb') &&
          collisionX !== 'ground' && collisionY !== 'ground' &&
          collisionX !== 'left_wall' && collisionY !== 'left_wall' &&
          collisionX !== 'right_wall' && collisionY !== 'right_wall') {
          let ver = (collisionX === 'bomb') ? 0 : 1;
          explodeBomb(game, bodyA, bodyB, ver);
        }
      }


      const preLandingEvent = ({ game, bodyA, bodyB }: any) => {
        game.fallingTetromino?.rigidBody.resetForces(true);
        removeGlow(game.fallingTetromino);
        fallingBlockGlowWithDelay(game.fallingTetromino);
        removeGlowWithDelay(game.fallingTetromino);
      }

      const LandingEvent = createLandingEvent(eraseThreshold, lineGrids, setMessage, setPlayerScore, setIsGameOver, true, true);

      const StepCallback = (game: TetrisGame, step: number) => {

        if (step % 15 != 0) {
          return;
        }
        if (step != 0 && step % 600 == 0) {
          console.log("아이템", step);
          setItem(getRandomItem(gameRef.current!));
        }
        const checkResult = game.checkLine(eraseThreshold);
        createScoreBasedGrid(lineGrids, checkResult.scoreList, eraseThreshold);
        showScore(checkResult.scoreList, scoreTexts.current, eraseThreshold);
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
        blockSpawnCallback: createBlockSpawnEvent(undefined, setNextBlock),
        worldHeight: 800,
        worldWidth: 600,
        wallColor: 0xFF0000,
        wallAlpha: 0.1,
        backgroundColor: 0x222929,
        backgroundAlpha: 0
      };

      const game = new TetrisGame(TetrisOption, "user");
      gameRef.current = game;
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

      let eventCallback = createUserEventCallback(game);
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
        game.run();
        setMessage("게임 시작!");
        scoreTexts.current.forEach((text) => {
          game.graphics.viewport.addChild(text);
        });
        lineGrids.forEach((line) => {
          game.graphics.viewport.addChild(line);
        });
        setTimeout(() => { setMessage("") }, 3000);
        id = setInterval(poseNetLoop, 250);
      }

      run();
      return () => {
        game.dispose();
        clearInterval(id);
      };
    }
  }, [isModalOpen]);



  return (
    <>
      <Volume page="ingame" />
      <ModalOverlay isOpen={isModalOpen} />
      <StyledTutorial isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
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
        <VideoContainer>
          <ButtonContainer>
            <RotateRightButton onClick={() => gameRef.current && rotateViewport(gameRef.current.graphics.viewport, 15)}>
            </RotateRightButton>
            <RotateLeftButton onClick={() => gameRef.current && rotateViewport(gameRef.current.graphics.viewport, -15)}>
            </RotateLeftButton>
            <ResetRotationButton onClick={() => gameRef.current && resetRotateViewport(gameRef.current.graphics.viewport)}>
            </ResetRotationButton>
            <FlipButton onClick={() => gameRef.current && flipViewport(gameRef.current.graphics.viewport)}>
            </FlipButton>
            <ResetFlipButton onClick={() => gameRef.current && resetFlipViewport(gameRef.current.graphics.viewport)}>
            </ResetFlipButton>
            <FogButton onClick={() => gameRef.current && addFog(gameRef.current)}>
            </FogButton>
            <BombButton onClick={() => gameRef.current && spawnBomb(gameRef.current, 150, 100)}>
            </BombButton>
          </ButtonContainer>
          <UserNickName>{nickname}</UserNickName>
          <Score> Score: {playerScore} </Score>
          <Video ref={videoRef} autoPlay />
          <VideoCanvas ref={canvasRef} />
        </VideoContainer>
        <UserBackGround />

        <GameOverModal visible={isGameOver}>
          <GameResult result="패배" score={playerScore} maxCombo={123} maxScore={456} />
          <GoLobbyButton id="go-home" onClick={() => window.location.href = '/gameLobby'}>홈으로 이동하기</GoLobbyButton>
        </GameOverModal>

      </Container>
      <BackgroundColor1>
        <Night>
          {shootingStars}
        </Night>
      </BackgroundColor1>
    </>
  );
};

export default TetrisSingle;