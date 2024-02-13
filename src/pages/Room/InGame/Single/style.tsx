import styled from 'styled-components';
import { BOMB_URL,FOG_URL,FLIP_URL,FLIP_NOT_URL,ROTATE_NOT_URL,ROTATE_LEFT_URL,ROTATE_RIGHT_URL } from "../../../../config"


export const ButtonContainer = styled.div`
  position: absolute;
  top: 10%;
  height: 9.3%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  flex-wrap: wrap;
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
`;


const IconButtonBase = styled.button`
  position: absolute;
  bottom: 8%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  border: 2px solid #fff;
  border-radius: 5px;
  width: 68px;
  height: 68px;
  cursor: pointer;
  position: relative;
  background-repeat: no-repeat;
  background-position: center 20px;
  background-size: 38px 38px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  scale: 0.6;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px #fff;
  }

  span {
    position: absolute;
    bottom: 78%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8px;
    font-weight: 600;
    color: black;
  }
`;
export const RotateRightButton = styled(IconButtonBase)`
  background-image: url(${ROTATE_RIGHT_URL});
`;

export const RotateLeftButton = styled(IconButtonBase)`
  background-image: url(${ROTATE_LEFT_URL});
`;

export const ResetRotationButton = styled(IconButtonBase)`
  background-image: url(${ROTATE_NOT_URL});
`;

export const FlipButton = styled(IconButtonBase)`
  background-image: url(${FLIP_URL});
`;

export const ResetFlipButton = styled(IconButtonBase)`
  background-image: url(${FLIP_NOT_URL});
`;

export const FogButton = styled(IconButtonBase)`
  background-image: url(${FOG_URL});
`;

export const BombButton = styled(IconButtonBase)`
  background-image: url(${BOMB_URL});
`;


export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const UserNickName = styled.div`
  position: absolute;
  top: 1%;
  left: 15%;
  transform: translateX(-50%);
  color: #FFF;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #FFF;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

export const Score = styled.div`
  position: absolute;
  top: 1%;
  right: 10%;
  transform: translateX(-50%);
  color: #FFF;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #FFF;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

export const SceneContainer = styled.div`
  top: 0%;
  left: 0%;
  width: 600px;
  height: 900px;
  position: absolute;
  background: #4e9cad;
`;

export const PlayerContainer = styled.div`
  top: 0%;
  left: 0%;
  width: 1000px;
  height: 900px;
  position: absolute;
  background: black;
`;

export const MultiplayContainer = styled.div`
  top: 0%;
  left: 65%;
  width: 600px;
  height: 800px;
  position: absolute;
  background: #423eee;
`

export const SceneCanvas = styled.canvas`
    width: 600px;
    height: 800px;
    left: 0%;
    top: 100px;
    position: absolute;
`;


export const VideoContainer = styled.div`
  position: relative;
  top: 30%;
  left: 57%;
  width: 800px;
  height: 600px;
  border: 2px solid black;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;


export const Video = styled.video`
  position: absolute;
  top: 20%;
  left: 0vw;
  width: 100%;
  height: 80%;
  transform: scaleX(-1);
  object-fit: cover;
`;

export const VideoCanvas = styled.canvas`
  position: absolute;
  top: 20%;
  left: 0vw;
  width: 100%;
  height: 80%;
  object-fit: cover;
`;

export const MessageDiv = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  color: white;
  background: rgba(255, 0, 0, 0.5);
  padding: 0px;
  font-size: 48px;
  z-index: 5;
  transform: translate(-50%, -50%);
`;

interface GameOverModalProps {
  visible: boolean;
}

export const GameOverModal = styled.div<GameOverModalProps>`
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`;

export const  UserBackGround = styled.div`
  width: 100%;
  height: 100%;
`;

export const ModalMessage = styled.p`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;  
  max-width: 800px; 
  text-align: center;
  font-size: 36px;
`;


interface GameResultProps {
  result: string;
  score: number;
  maxCombo: number;
  maxScore: number;
}

export const GameResult: React.FC<GameResultProps> = ({ result, score, maxCombo, maxScore }) => (
  <ModalMessage id="modal-message">
    게임 결과: {result}<br />
    점수: {score}<br />
    최대 콤보 수: {maxCombo}<br />
    최대 득점량: {maxScore}
  </ModalMessage>
);


export const GoLobbyButton = styled.button`
  position: absolute;
  top: 60%;
  left:45%;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

export const TetrisNextBlock = styled.div`
  position: absolute;
  top: 12.4vh;
  right: 15.5vw;
  width: 23vw;
  height: 9.1vh;
  border: 2px solid black;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  font-size: 20px;
  color: lightblue;
  background: gray;
`;