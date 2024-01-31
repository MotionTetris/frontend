// src/components/GameRoom.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { togglePlayerReady, startGame } from '../../redux/game/gameSlice';
import {
  RoomContainer,
  StartButton, 
  ReadyButton,
  TetrisBackButton,
} from './styles';
// import { getUserProfileAndRoomData } from '@api/room';
import { UserProfile } from '../../types/room';
import Player from '@components/Room/Player/Player';
import { useSocketIO } from "@api/WebSocket/useSocketIO";

const GameRoom: React.FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.game.player);
  const allReady = useSelector((state: RootState) => state.game);
  const buttonText = player.playerstatus === 'WAIT' ? '준비하기' : '대기하기';
  const socket = useSocketIO('localhost:3001');
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const roomStatus = useSelector((state:RootState) => state.roomState)
  const handleStartButtonClick = () => {
    if (startGame) {
      dispatch(startGame());
      // 여기에 게임 시작 관련 로직을 추가하세요.
    }
  };

  const handleReadyButtonClick = () => {
    dispatch(togglePlayerReady());
    // 여기에 ready 상태를 toggle하는 로직을 추가하세요.
  };

  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userProfileData: UserProfile = await getUserProfileAndRoomData();
  //       setUserProfiles([userProfileData]); // userProfileData를 배열에 넣어줌
  //       console.log("API 호출 결과:", userProfileData);
  //     } catch (error) {
  //       console.error('Error fetching data: ', error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  
  return (
    <RoomContainer>
      <TetrisBackButton>Logo Here</TetrisBackButton>
      {userProfiles.map((profile, index) => (
  <Player key={index} nickname={profile.nickname} />
))}
      {player.Role === 'CREATOR' && (
        <StartButton disabled={!allReady} onClick={handleStartButtonClick}>
          Start Game
        </StartButton>
      )}
      <ReadyButton playerstatus={player.playerstatus} onClick={handleReadyButtonClick}>
        {buttonText}
      </ReadyButton>
    </RoomContainer>
  );
};

export default GameRoom;