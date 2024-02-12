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
  playerStyles
} from "./styles";
import Player from "@components/Player/Player";
import { useRoomSocket, RoomSocketEvent } from "@context/roomSocket";
import { InGamePlayerCard } from "@type/Refactoring";
import { BackgroundColor1, Night, ShootingStar } from "@src/BGstyles";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '@app/store';
import { setOtherNickname, setCreatorNickname } from "@redux/game/gameSlice";


const GameRoom: React.FC = () => {
  const navigate = useNavigate();
  const [inGameCard, setInGameCard] = useState<InGamePlayerCard | null>(null);
  const roomSocket = useRoomSocket();
  const { roomId: roomIdString } = useParams<{ roomId: string }>();
  const roomId = parseInt(roomIdString || "");
  const location = useLocation();
  const roomInfo = location.state as { roomInfo: InGamePlayerCard, isCreator: boolean } | undefined;
  const [isReady, setIsReady] = useState(false);
  const currentPlayerNickname = useSelector((state: RootState) => state.homepage.nickname);
  const [players, setPlayers] = useState<string[]>([]);
  const [isGameALLReady, setIsGameALLReady] = useState(false);
  const dispatch = useDispatch();

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
    dispatch(setCreatorNickname(roomInfo.roomInfo.creatorNickname));
    dispatch(setOtherNickname(new Set(roomInfo.roomInfo.playersNickname || [])));
    setInGameCard(roomInfo.roomInfo);
    const playersNickname = Array.from(roomInfo.roomInfo.playersNickname || []);
    const creatorNickname = roomInfo.roomInfo.creatorNickname;

    if (roomInfo.isCreator) {
      const otherPlayers = playersNickname.filter(nickname => nickname !== currentPlayerNickname);
      setPlayers([currentPlayerNickname, ...randomizePlayers(otherPlayers)]);
    } else {
      const otherPlayers = playersNickname.filter(nickname => nickname !== creatorNickname && nickname !== currentPlayerNickname);
      setPlayers([currentPlayerNickname, ...randomizePlayers(otherPlayers)]);
    }
  }

  roomSocket?.on(RoomSocketEvent.ON_JOIN_ROOM, (users) => {
    const otherUsersNicknames = users.filter((user: string) => user !== currentPlayerNickname);
    const otherUsersNicknamesSet = new Set<string>(otherUsersNicknames);
    dispatch(setOtherNickname(otherUsersNicknamesSet));
    setPlayers([currentPlayerNickname, ...shufflePlayers(otherUsersNicknames)]);
    setIsReady(false);
  });
  
  roomSocket?.on(RoomSocketEvent.EMIT_EXIT, () => {
    timeoutId = setTimeout(() => {
      roomSocket?.emit(RoomSocketEvent.EMIT_EXIT, currentPlayerNickname);
    }, 60000);
  });

  roomSocket?.on(RoomSocketEvent.EMIT_JOIN, () => {
    clearTimeout(timeoutId);
  });

  roomSocket?.on(RoomSocketEvent.ON_GAME_ALLREADY, () => {
    setIsGameALLReady(true);
  });

  roomSocket?.on(RoomSocketEvent.ON_GAME_START, () => {
    navigate(`/gameplay?roomId=${roomInfo?.roomInfo.roomId}&max=${roomInfo?.roomInfo.maxCount}`);
  });

  return () => {
    clearTimeout(timeoutId);
    roomSocket?.off(RoomSocketEvent.ON_JOIN_ROOM);
    roomSocket?.off(RoomSocketEvent.EMIT_EXIT);
    roomSocket?.off(RoomSocketEvent.EMIT_JOIN);
    roomSocket?.off(RoomSocketEvent.ON_GAME_ALLREADY);
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
  if (!isReady) {
    setIsReady(true);
    roomSocket?.emit(RoomSocketEvent.EMIT_GAME_READY, { roomId });
  }
};

  const handleBackButtonClick = () => {
    roomSocket?.emit(RoomSocketEvent.EMIT_EXIT, { roomId });
    navigate('/GameMain');
  };



  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  

  return (
    <RoomContainer>
      <GameRoomId>{inGameCard?.roomId}</GameRoomId>
      <GameRoomTitle>{inGameCard?.roomTitle}</GameRoomTitle>
      <FaBackspaced onClick={handleBackButtonClick} />
      {isCreator ? (
        <StartButton 
  disabled={players.length !== 1 && !isGameALLReady}
  onClick={() => {
    if (players.length === 1) {
      if (window.confirm('싱글 게임으로 시작하시겠습니까?')) {
        navigate('/singleplay');
      }
    } else {
      roomSocket?.emit(RoomSocketEvent.EMIT_GAME_START);
    }
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
