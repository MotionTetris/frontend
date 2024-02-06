import React, { useEffect, useRef } from "react";
import {
  PlayerContainer,
  PlayerBackground,
  VideoContainer,
  PlayerNickName,
  Badge,
} from "./styles";

interface PlayerProps {
  nickname: string;
  isCreator: boolean;
  scale: number;
  position: string;
  top: string;
  left: string;
}

const Player: React.FC<PlayerProps> = ({ nickname, isCreator, scale, position, top, left }) => {
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
    <PlayerContainer style={{ transform: `scale(${scale})`, position, top, left }}>
      <PlayerBackground/>
      <PlayerNickName>{nickname}</PlayerNickName>
      {isCreator && <Badge>방장</Badge>}
      <VideoContainer ref={videoRef} autoPlay playsInline />
    </PlayerContainer>
  );
};

export default Player;
