import React, { useEffect, useRef } from "react";
import {
  PlayerContainer,
  PlayerBackground,
  VideoContainer,
  PlayerNickName,
} from "./styles";
import { InGamePlayerCard } from "../../types/Refactoring";
interface PlayerCardProps {
  playerCard: InGamePlayerCard;
}

/* TODO : GameRoom에 입장했을 때 받은 정보 'RoomInfo' 중 creatorNickname, playersNickname 을 받아서 사용 */
const Player: React.FC<PlayerCardProps> = ({ playerCard }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const connectWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("웹캠 연결에 실패했습니다.", error);
      }
    };
    connectWebcam();
  }, []);

  return (
    <PlayerContainer>
      <PlayerBackground alt="Background" />
      <PlayerNickName> {playerCard.creatorNickname} </PlayerNickName>
      <VideoContainer ref={videoRef} autoPlay playsInline />
    </PlayerContainer>
  );
};

export default Player;
