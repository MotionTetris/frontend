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
  FaBackspaced
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
  const [inGameCards, setInGameCards] = useState<InGamePlayerCard[]>([]);
  const {roomSocket} = useRoomSocket();
  const { roomId: roomIdString } = useParams<{ roomId: string }>();
  const roomId = parseInt(roomIdString || "");
  const location = useLocation();
  const roomInfo = location.state as { roomInfo: InGamePlayerCard } | undefined;
  const [isReady, setIsReady] = useState(false);
  const currentPlayerNickname = useSelector((state: RootState) => state.homepage.nickname);
  if (isNaN(roomId)) {
    console.error('Invalid roomId');
    navigate('/error');
    return;
  }

  console.assert(roomSocket, "socket is undefined");

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
    console.log("inGameCard.roomId: ", roomInfo.roomInfo.roomId);
    console.log("inGameCard.roomTitle: ", roomInfo.roomInfo.roomTitle);
    console.log("플레이어닉네임배열이냐?: ", roomInfo.roomInfo.playersNickname);
    console.log("만든닉네임이냐?: ", roomInfo.roomInfo.creatorNickname);
  }

}, [roomInfo]);

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
      {inGameCards.map((card, index) => {
        console.log("Player card: ", card); // Player로 전달되는 card 값 로깅
        return <Player key={index} playerCard={card} />;
      })}
      {isCreator ? (
        <StartButton onClick={() => {
          roomSocket?.emit(RoomSocketEvent.EMIT_GAME_START);
          navigate('/gameplay');
        }}>Start Game</StartButton>
      ) : (
        isReady && <ReadyButton onClick={handleReadyClick}>{isReady ? '대기 중' : '준비 중'}</ReadyButton>
      )}

      <BackgroundColor1>
        <Night>
          {shootingStars}
        </Night>
      </BackgroundColor1>
    </RoomContainer>
  );
};

export default GameRoom;
