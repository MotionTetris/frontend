// src/components/GameRoom.tsx
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
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
  if (roomInfo) {
    setInGameCard(roomInfo.roomInfo);
    const playersNickname = Array.from(roomInfo.roomInfo.playersNickname || []);
    const creatorNickname = roomInfo.roomInfo.creatorNickname;
    const otherPlayers = playersNickname.filter(nickname => nickname !== currentPlayerNickname && nickname !== creatorNickname);

    if (roomInfo.isCreator) {
      setPlayers([currentPlayerNickname, ...otherPlayers]);
      console.log("플레이어 배정 (방 생성): ", [currentPlayerNickname, ...otherPlayers]);
    }
    else {
      setPlayers([creatorNickname, currentPlayerNickname, ...otherPlayers]);
      console.log("플레이어 배정 (방 참가): ", [creatorNickname, currentPlayerNickname, ...otherPlayers]);
    }
  }

  // 새로운 사용자가 방에 들어온 경우
  roomSocket?.on('joinUser', (users) => {
    setPlayers(users);
  });

  // 사용자가 방을 떠난 경우
  roomSocket?.on('leaveRoom', (users) => {
    setPlayers(users);
  });

  return () => {
    // 컴포넌트가 unmount 될 때 이벤트 리스너를 제거
    roomSocket?.off('joinUser');
    roomSocket?.off('leaveRoom');
  };
}, [roomInfo, currentPlayerNickname, roomSocket]);


const isCreator = inGameCard?.creatorNickname === currentPlayerNickname;

  const handleReadyClick = () => {
    setIsReady(!isReady);
    roomSocket?.emit(RoomSocketEvent.EMIT_GAME_START, !isReady);
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
        <StartButton onClick={() => {
          roomSocket?.emit(RoomSocketEvent.EMIT_GAME_START);
          navigate('/gameplay');
        }}>Start Game</StartButton>
      ) : (
        isReady && <ReadyButton onClick={handleReadyClick}>{isReady ? '대기 중' : '준비 중'}</ReadyButton>
      )}
     <PlayerContainer>
       {players.map((player, index) => {
    const isCreator = player === inGameCard?.creatorNickname;

    // StyledPlayer에 전달되는 속성 값들을 콘솔에 출력
    console.log('Player props:', {
      scale: playerStyles[index].scale,
      position: playerStyles[index].position,
      top: playerStyles[index].top,
      left: playerStyles[index].left,
    });

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
