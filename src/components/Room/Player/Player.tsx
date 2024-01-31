import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  PlayerStatus,
  TetrisPlayer,
  PlayerBackground,
  VideoContainer,
  PlayerNickName,
  PlayerProficture,
} from './styles';
import { RootState } from '../../../app/store';  // RootState를 import 합니다.
import { createRoomAPI } from '../../../api/room'
import { UserProfile } from '../../../types/room'
import { roomStatusSlice } from '../../../redux/roomStatus/roomStatusSlice'  // roomStatusSlice를 import 합니다.
import { useDispatch } from 'react-redux';

interface PlayerProps {
  nickname: string;
}

const Player: React.FC<PlayerProps> = ({ nickname }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomData = useSelector((state: RootState) => state.roomState.roomData);
  const [fetchedRoomData, setFetchedRoomData] = useState<UserProfile| null>(null);
  const dispatch = useDispatch();  // dispatch 함수를 가져옵니다.

  useEffect(() => {
    // 웹캠 연결 로직
    const connectWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('웹캠 연결에 실패했습니다.', error);
      }
    };
    connectWebcam();
  }, []);

  useEffect(() => {
    const fetchRoomData = async () => {
      const fetchedData = await createRoomAPI(roomData);
      setFetchedRoomData(fetchedData); 
      fetchRoomData().then(() => {
        if (fetchedRoomData) {
          dispatch(roomStatusSlice.actions.drawUserInterface(fetchedData));
        }
      });
    };
  }, [nickname]);


  if (!fetchedRoomData) {
    return null;  // 방 정보를 찾을 수 없으면 null을 반환합니다.
  }

  console.log('fetchedRoomData 값:', fetchedRoomData);
  return (
     <TetrisPlayer>
      <PlayerBackground src={fetchedRoomData.bannerBackground} alt="Background" />
      <PlayerNickName>{fetchedRoomData.nickname}</PlayerNickName>
      <PlayerProficture src={fetchedRoomData.profilePicture} alt="Profile Picture" />
      <PlayerStatus playerstatus={fetchedRoomData.playerstatus}>
        {fetchedRoomData.playerstatus === 'WAIT' ? '대기 중' : '준비 중'}
      </PlayerStatus>
      <VideoContainer ref={videoRef} autoPlay playsInline />
    </TetrisPlayer>
  );
};

export default Player;
