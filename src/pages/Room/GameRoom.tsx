// src/components/GameRoom.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {
  RoomContainer,
  StartButton,
  ReadyButton,
  GameRoomId,
  GameRoomTitle,
  FaBackspaced,
  PlayerContainer,
  StyledPlayer,
  playerStyles
} from "./styles";
import Player from "@components/Player/Player";
import { useRoomSocket, RoomSocketEvent } from "../../context/roomSocket";
import { InGamePlayerCard } from "../../types/Refactoring";
import { BackgroundColor1, Night, ShootingStar } from "../../BGstyles";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const GameRoom: React.FC = () => {
  const navigate = useNavigate();
  const [inGameCard, setInGameCard] = useState<InGamePlayerCard | null>(null);
  const {roomSocket} = useRoomSocket();
  const { roomId: roomIdString } = useParams<{ roomId: string }>();
  const roomId = parseInt(roomIdString || "");
  const location = useLocation();
  const roomInfo = location.state as { roomInfo: InGamePlayerCard, isCreator: boolean } | undefined;
  const [isReady, setIsReady] = useState(false);
  const currentPlayerNickname = useSelector((state: RootState) => state.homepage.nickname);
  const [players, setPlayers] = useState<string[]>([]);
  const [isGameALLReady, setIsGameALLReady] = useState(false);

  const shootingStars = Array(20).fill(null).map((_, index) => 
<ShootingStar 
  style={{ 
    left: `${Math.random() * 100}%`, 
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`
  }} 
  key={index} 
/>);

useEffect(() => {
  let timeoutId: NodeJS.Timeout;

  if (roomInfo) {
    setInGameCard(roomInfo.roomInfo);
    const playersNickname = Array.from(roomInfo.roomInfo.playersNickname || []);
    const creatorNickname = roomInfo.roomInfo.creatorNickname;
    
    if (roomInfo.isCreator) {
      const otherPlayers = playersNickname.filter(nickname => nickname !== currentPlayerNickname);
      setPlayers([currentPlayerNickname, ...randomizePlayers(otherPlayers)]);

      roomSocket?.on(RoomSocketEvent.ON_GAME_ALLREADY, () => {
        setIsGameALLReady(true);
      });
    }
    else {
      const otherPlayers = playersNickname.filter(nickname => nickname !== creatorNickname && nickname !== currentPlayerNickname);
      setPlayers([currentPlayerNickname, ...randomizePlayers(otherPlayers)]);
    }
  }

  roomSocket?.on(RoomSocketEvent.ON_JOIN_ROOM, (users) => {
    const otherUsers = users.filter((user: string) => user !== currentPlayerNickname);
    setPlayers([currentPlayerNickname, ...shufflePlayers(otherUsers)]);
  });
  
  roomSocket?.on(RoomSocketEvent.EMIT_EXIT, () => {
    timeoutId = setTimeout(() => {
      roomSocket?.emit(RoomSocketEvent.EMIT_EXIT, currentPlayerNickname);
    }, 60000);
  });

  roomSocket?.on(RoomSocketEvent.EMIT_JOIN, () => {
    clearTimeout(timeoutId);
  });

  roomSocket?.on(RoomSocketEvent.ON_GAME_START, () => {
    navigate(`/gameplay?roomId=${roomInfo?.roomInfo.roomId}&max=${roomInfo?.roomInfo.maxCount}`);
  });

  return () => {
    clearTimeout(timeoutId);
    roomSocket?.off(RoomSocketEvent.ON_JOIN_ROOM);
    roomSocket?.off(RoomSocketEvent.EMIT_EXIT);
    roomSocket?.off(RoomSocketEvent.EMIT_JOIN);

    if (roomInfo?.isCreator) {
      roomSocket?.off(RoomSocketEvent.ON_GAME_ALLREADY);
    }
  };
}, [roomInfo, currentPlayerNickname, roomSocket]);

function randomizePlayers(players: string[]) {
  return players.sort(() => Math.random() - 0.5);
}

function shufflePlayers(players: string[]) {
  const otherPlayers = players.filter(player => player !== currentPlayerNickname);
  const shuffledPlayers = randomizePlayers(otherPlayers);
  return shuffledPlayers;
}

const isCreator = inGameCard?.creatorNickname === currentPlayerNickname;

  const handleReadyClick = () => {
    setIsReady(!isReady);
    roomSocket?.emit(RoomSocketEvent.EMIT_GAME_READY, {roomId});
  };

  const handleBackButtonClick = () => {
    navigate('/GameMain');
  };

  return (
    <RoomContainer>
      <GameRoomId>{inGameCard?.roomId}</GameRoomId>
      <GameRoomTitle>{inGameCard?.roomTitle}</GameRoomTitle>
      <FaBackspaced onClick={handleBackButtonClick} />
      {isCreator ? (
  <StartButton 
  disabled={!isGameALLReady}
  onClick={() => {
    roomSocket?.emit(RoomSocketEvent.EMIT_GAME_START);
  }}
>
  Start Game
</StartButton>
) : (
  <ReadyButton onClick={handleReadyClick}>{isReady ? '대기 중' : '준비 중'}</ReadyButton>
)}
     <PlayerContainer>
       {players.map((player, index) => {
    const isCreator = player === inGameCard?.creatorNickname;

    return (
      <Player 
        key={index} 
        nickname={player} 
        isCreator={isCreator} 
        scale={playerStyles[index].scale} 
        position={playerStyles[index].position} 
        top={playerStyles[index].top}
        left={playerStyles[index].left}
      />
    );
  })}
    </PlayerContainer>

      <BackgroundColor1>
        <Night>
          {shootingStars}
        </Night>
      </BackgroundColor1>
    </RoomContainer>
  );
};

export default GameRoom;
