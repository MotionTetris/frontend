import styled, { keyframes } from 'styled-components';
import { BOMB_URL, FOG_URL, FLIP_URL, FLIP_NOT_URL, ROTATE_NOT_URL, ROTATE_LEFT_URL, ROTATE_RIGHT_URL } from "../../../../config"
import Tutorial from "@src/components/Tutorial/tutorial.tsx";

export const ButtonContainer = styled.div`
  position: absolute;
  top: -10%;
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
  border: 5px solid #fff;
  border-radius: 20px;
  width: 68px;
  height: 68px;
  cursor: pointer;
  position: relative;
  background-repeat: no-repeat;
  background-position: center 8px;
  background-size: 42px 42px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  scale: 0.6;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px #fff;
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
  top: -163px;
  left: 352px;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 20px;
  color: #FFF;
  background: #323232;
  border-top: 2px solid black;
  border-right: 2px solid black;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
`;

export const Score = styled.div`
  position: absolute;
  top: -101px;
  left: 352px;
  transform: translate(-50%, -50%);
  width: 259px;
  height: 59px;
  color: #FFF;
  background: #0D7377;
  padding: 10px 20px;
  border-right: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
`;

export const SceneContainer = styled.div`
  top: -50px;
  left: 0%;
  width: 600px;
  height: 900px;
  position: absolute;
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
`

export const SceneCanvas = styled.canvas`
  position: absolute;
  top: ${({ id }) => (id === 'otherGame' ? '100px' : '100px')};
  left: ${({ id }) => (id === 'otherGame' ? '-10px' : '70px')};
`;

export const VideoContainer = styled.div`
  position: absolute;
  top: 280px;
  left: 660px;
  width: 500px;
  height: 618px;
  border: 2px solid black;
  background-color: white;
  `;

export const Video = styled.video`
  position: absolute;
  top: 0%;
  left: 0vw;
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
  object-fit: cover;
`;

export const VideoCanvas = styled.canvas`
  position: absolute;
  top: 0%;
  left: 0vw;
  width: 100%;
  height: 100%;
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

export const UserBackGround = styled.div`
  width: 100%;
  height: 100%;
`;



interface GameResultProps {
  result: string;
  score: number;
  maxCombo: number;
  maxScore: number;
}


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

export const TetrisNextBlockContainer = styled.div`
position: relative;
top: 90px;
left: 552px;
display: flex;
flex-direction: column;
align-items: center;
width: 600px;
height: 400px;
`;

export const TextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 100px;
  width: 200px;
  background: #212121;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  height: 40px;
  z-index: 1;
`;



export const NextBlockText = styled.div`
  position: absolute;
  font-size: 20px;
  color: white;
  font-weight: bold;
`;

export const NextBlockImage = styled.div`
  position: absolute;
  top: 0px; // 상단 정렬
  left: 100px; // 좌측 정렬
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 200px;
  height: 20%;
  border: 2px solid black;
  background: white;
  img {
    margin-top: 10px;
    width: 60px;
    height: 60px;
  }
`;

export const OtherNickName = styled.div`
  position: absolute;
  top:55px;
  left:-10px;
  width: 260px;
  height: 20px;
  color: #FFF;
  background: #323232;
  border: 2px solid black;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const ModalMessage = styled.p`
  background: linear-gradient(45deg, #000080 30%, #000000 90%); // 남색에서 검정으로 변하는 그라디언트 배경 적용
  padding: 20px;
  border-radius: 10px;
  width: 80%;  
  max-width: 800px; 
  text-align: center;
  font-size: 36px;
  color: white; // 텍스트 색상은 흰색 유지
  box-shadow: 0 3px 5px 2px rgba(0, 0, 128, .3); // 그림자 색상을 남색 계열로 변경
  transition: all 0.3s ease-out;
  animation: ${fadeIn} 1s ease-in;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 8px 3px rgba(0, 0, 128, .3);
  }
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
    나의 점수: {score}<br />
    나의 최대 콤보 수: {maxCombo}<br />
    나의 최대 득점량: {maxScore}<br />
  </ModalMessage>
);

export const ModalOverlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

export const StyledTutorial = styled(Tutorial)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;