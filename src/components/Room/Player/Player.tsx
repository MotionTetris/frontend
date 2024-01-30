// test/frontend/src/components/Room/Player.tsx
import React, { useEffect, useRef } from 'react';
import {
  PlayerStatus,
  TetrisPlayer,
  PlayerBackground,
  VideoContainer,
  PlayerNickName,
  PlayerProficture,
} from './styles';
import { UserProfile } from '../../../types/room';

interface PlayerProps {
  userProfile: UserProfile;
}

const Player: React.FC<PlayerProps> = ({ userProfile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);  // videoRef 생성
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

  return (
    <TetrisPlayer>
      <PlayerBackground src={userProfile.bannerBackground} alt="Background" />
      <PlayerNickName>{userProfile.nickname}</PlayerNickName>
      <PlayerProficture src={userProfile.profilePicture} alt="Profile Picture" />
      <PlayerStatus playerstatus={userProfile.playerstatus}> {/* 상태 표시 텍스트 변경 필요 */}
        {userProfile.playerstatus === 'WAIT' ? '대기 중' : '준비 중'}
      </PlayerStatus>
      <VideoContainer ref={videoRef} autoPlay playsInline />
    </TetrisPlayer>
  );
};

export default Player;
