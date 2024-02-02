// src/components/GameRoom.tsx
import { useEffect, useState } from "react";
import {
  RoomContainer,
  StartButton,
  ReadyButton,
  TetrisBackButton,
  GameRoomId,
  GameRoomTitle,
} from "./styles";
import Player from "@components/Player/Player";
import { useRoomSocket, RoomSocketEvent } from "../../context/roomSocket";
import { InGamePlayerCard } from "../../types/Refactoring";

const GameRoom: React.FC = () => {
  const [inGameCard, setInGameCard] = useState<InGamePlayerCard | null>(null);
  const [currentPlayerNickname, setCurrentPlayerNickname] = useState<string>("");
  const [ingameStart, setGameStart] = useState<InGamePlayerCard | null>(null);

  const socket = useRoomSocket();
  console.assert(socket, "socket is undefined");

  useEffect(() => {
    const handleInGameCard = (data: InGamePlayerCard) => {
      setInGameCard(data);
    };
    const gameStart = (data: InGamePlayerCard) => {
      setGameStart(data);
    };
    socket?.on(RoomSocketEvent.EMIT_JOIN, handleInGameCard);
    socket?.on(RoomSocketEvent.EMIT_GAME_START, gameStart);
    return () => {
      socket?.off(RoomSocketEvent.EMIT_JOIN, handleInGameCard);
      socket?.off(RoomSocketEvent.EMIT_GAME_START, gameStart);
    };
  }, []);

  const isCreator = inGameCard?.creatorNickname === currentPlayerNickname;

  return (
    <RoomContainer>
      <GameRoomId>{inGameCard?.roomId}</GameRoomId>
      <GameRoomTitle>{inGameCard?.roomTitle}</GameRoomTitle>
      <TetrisBackButton>Logo Here</TetrisBackButton>
      {inGameCard && <Player playerCard={inGameCard} />}
      <StartButton>Start Game</StartButton>
      {isCreator ? (
        <StartButton>Start Game</StartButton>
      ) : (
        <ReadyButton>Ready</ReadyButton>
      )}
    </RoomContainer>
  );
};

export default GameRoom;
