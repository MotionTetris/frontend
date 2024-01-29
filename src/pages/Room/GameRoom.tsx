// src/components/Room1.tsx
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { startGame, togglePlayerReady } from '../../features/game/gameSlice';
import { RootState } from '@app/store';
import {
  RoomContainer,
  LogoArea,
  SinglePlayIndicator,
  MainTetrisArea,
  NextBlockArea,
  MotionArea,
  ScoreArea,
  PlayerInfoArea,
  BackgroundArea,
  WarningModal,
  ModalContent,
  ModalButton
} from './styles'; // Styled components import

const GameRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerData = useSelector((state: RootState) => state.game.player);
  const rooms = useSelector((state: RootState) => state.game.rooms);

  const handleStartGame = () => {
    if (playerData.role === 'CREATOR' && playerData.playerstatus === 'READY') {
      dispatch(startGame());
      switch (rooms.length) {
        case 1:
          navigate('/page1');
          break;
        case 2:
          navigate('/page2');
          break;
        case 3:
          navigate('/page3');
          break;
        // 4명일 경우 현재 페이지 유지
        default:
          break;
      }
    } else {
      // Show warning modal
    }
  };


  console.log("GameRoom rendered!")
  return (
    <RoomContainer>
      <LogoArea>Logo Here</LogoArea>
      <SinglePlayIndicator>Single Play</SinglePlayIndicator>
      <MainTetrisArea>Main Tetris Area</MainTetrisArea>
      <NextBlockArea>Next Block Area</NextBlockArea>
      <MotionArea>Motion Area</MotionArea>
      <ScoreArea>Score: {playerData.score}</ScoreArea>
      <PlayerInfoArea>Player Info</PlayerInfoArea>
      <BackgroundArea>Background</BackgroundArea>
      {playerData.role === 'CREATOR' ? (
        <button onClick={handleStartGame}>시작하기</button>
      ) : (
        <button onClick={() => dispatch(togglePlayerReady())}>준비하기</button>
      )}
      <WarningModal>
        <ModalContent>
          아직 게임이 진행 중입니다! 나가시면 10분간 게임 입장이 불가능합니다 나가시겠습니까?
        </ModalContent>
        <ModalButton>예</ModalButton>
        <ModalButton>아니오</ModalButton>
      </WarningModal>
    </RoomContainer>
  );
};

export default GameRoom;
