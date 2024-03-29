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
  playerStyles,
  RoomInfoContainer
} from "./styles";
import Player from "@components/Player/Player";
import { useRoomSocket, RoomSocketEvent } from "@context/roomSocket";
import { InGamePlayerCard } from "@type/Refactoring";
import { BackgroundColor1, Night, ShootingStar } from "@src/BGstyles";
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setOtherNickname, setCreatorNickname } from "@redux/game/gameSlice";
import { getUserNickname } from "@src/data-store/token";
import { ModalOverlay, StyledTutorial } from "./InGame/Single/style";
import Chat from "@src/components/Ingame/Chat";
import { playReadySound, playStartSound } from "@src/components/sound";
import Volume from "@src/components/volume";


const GameRoom: React.FC = () => {
  const navigate = useNavigate();
  const [inGameCard, setInGameCard] = useState<InGamePlayerCard | null>(null);
  const roomSocket = useRoomSocket();
  const { roomId: roomIdString } = useParams<{ roomId: string }>();
  const roomId = parseInt(roomIdString || "");
  const location = useLocation();
  const roomInfo = location.state as { roomInfo: InGamePlayerCard, isCreator: boolean } | undefined;
  const [isReady, setIsReady] = useState(false);
  const currentPlayerNickname = getUserNickname();
  const [players, setPlayers] = useState<string[]>([]);
  const [isGameALLReady, setIsGameALLReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
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

  if (!roomSocket || !roomSocket.connected) {
    alert("서버와의 통신에 실패하였습니다! 메인 페이지로 돌아갑니다!");
    navigate("/", {replace: true});
    return <Navigate to='/' replace/>
  }

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

    roomSocket?.on(RoomSocketEvent.ON_GAME_ALLREADY, (isAllReady: boolean) => {
      setIsGameALLReady(isAllReady);
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
    playReadySound();
    setIsReady(!isReady);
    roomSocket?.emit(RoomSocketEvent.EMIT_GAME_READY, { roomId });
  };

  const handleBackButtonClick = () => {
    roomSocket?.emit(RoomSocketEvent.EMIT_EXIT, { roomId });
    navigate('/gamemain', {
      replace: true
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleUnload = () => {
      roomSocket?.emit(RoomSocketEvent.EMIT_EXIT, { roomId });
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return (
    
    <RoomContainer>
      <Volume page="room"></Volume>
      <ModalOverlay isOpen={isModalOpen} />
      <StyledTutorial isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
      <RoomInfoContainer>
      <GameRoomId>{inGameCard?.roomId}</GameRoomId>
      <GameRoomTitle>{inGameCard?.roomTitle}</GameRoomTitle>
      </RoomInfoContainer>
      <FaBackspaced onClick={handleBackButtonClick} />
      {isCreator ? (
        <StartButton
          disabled={players.length !== 1 && !isGameALLReady}
          onClick={() => {
            if (players.length === 1) {
                playStartSound();
                navigate(`/gameplay?roomId=${roomInfo?.roomInfo.roomId}&max=${roomInfo?.roomInfo.maxCount}`);
            } else {
              roomSocket?.emit(RoomSocketEvent.EMIT_GAME_START);
              playStartSound();
            }
          }}
        >
          게임 시작
        </StartButton>
      ) : (
        <ReadyButton onClick={handleReadyClick} isReady={isReady}>{isReady ? '준비 취소' : '준비 하기'}</ReadyButton>
      )}
    <PlayerContainer>
  {players.map((player, index) => {
    const isCreator = player === inGameCard?.creatorNickname;
    return (
      <Player
        key={index}
        nickname={player}
        isCreator={isCreator}
        isReady={isGameALLReady}
        scale={playerStyles[index].scale}
        position={playerStyles[index].position}
        top={playerStyles[index].top}
        left={playerStyles[index].left}
      />
    );
  })}
</PlayerContainer>
<Chat 
  isCreator={isCreator}
  players={players.filter(player => player !== currentPlayerNickname)}
/>
      <BackgroundColor1>
        <Night>
          {shootingStars}
        </Night>
      </BackgroundColor1>
    </RoomContainer>
  );
};

export default GameRoom;
