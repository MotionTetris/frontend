import React from "react";
import {
  PlayerContainer,
  PlayerBackground,
  PlayerNickName,
  Badge,
} from "./styles";

interface PlayerProps {
  nickname: string;
  isCreator: boolean;
  isReady: boolean;
  scale: number;
  position: string;
  top: string;
  left: string;
}

const Player: React.FC<PlayerProps> = ({ nickname, isCreator, isReady, scale, position, top, left }) => {
  return (
    <PlayerContainer style={{ transform: `scale(${scale})`, position, top, left }}>
      <PlayerBackground/>
      <PlayerNickName>{nickname}</PlayerNickName>
      {isCreator ? <Badge>방장</Badge> : isReady ? <Badge>Ready</Badge> : null}
    </PlayerContainer>
  );
};


export default Player;
