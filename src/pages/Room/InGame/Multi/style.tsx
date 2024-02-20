import styled, { css, keyframes } from 'styled-components';
import { BOMB_URL, FOG_URL, FLIP_URL, FLIP_NOT_URL, ROTATE_NOT_URL, ROTATE_LEFT_URL, ROTATE_RIGHT_URL } from "../../../../config"


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


export const DarkBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 1);
  opacity: 0;
  z-index: 48;
`
export const UserNickName = styled.div`
  position: absolute;
  top: -107px;
  left: 489px;
  transform: translate(-50%, -50%);
  width: 536px;
  height: 28px;
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
  top: -40px;
  left: 491px;
  transform: translate(-50%, -50%);
  width: 532px;
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
  top: 0px;
  left: -2%;
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
  top: 0px;
  left: 72%;
  width: 600px;
  height: 800px;
  position: absolute;
`
interface CombineLineProps {
  Combine: boolean;
}

const glow = keyframes`
  0% {
    box-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff;
  }
  100% {
    box-shadow:  0 0 10px #00ff00,0 0 20px #00ff00,0 0 30px #00ff00,
  }
`
export const SceneCanvas = styled.canvas<CombineLineProps>`
  position: absolute;
  top: ${({ id }) => (id === 'otherGame' ? '100px' : '100px')};

  left: ${({ id }) => (id === 'otherGame' ? '-30px' : '110px')};
  border: 2px solid white;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  box-shadow:  0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff,
  ${({ Combine }) =>
    Combine &&
    css`
      animation: ${glow} 0.25s infinite alternate;
    `}
`;

export const VideoContainer = styled.div`
  position: absolute;
  top: 228px;
  left: 572px;
  width: 776px;
  height: 668px;
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
  top: 30%;
  left: 60%;
  color: #3A4CA8;
  padding: 0px;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 600;
  font-size: 40px;
  z-index: 5;
  transform: translate(-50%, -50%);
  background: transparent;
  text-shadow: 
    2px 2px 0px #FFF,
    -2px -2px 0px #FFF,
    -2px 2px 0px #FFF,
    2px -2px 0px #FFF,
    20px 0px 5px rgba(0, 0, 0, 0.5);
  animation: light 1s linear infinite;
  text-align: center;
  white-space: nowrap;
  
  @keyframes light {
    0% { color: #3A4CA8; }
    50% { color: #657ED4; }
    100% { color: #3A4CA8; }
  }
`;

interface ModalMessageProps {
  color?: string; // color prop은 optional입니다.
}


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
  background-color: rgba(0,0,0,0.6); // 더 진한 배경색으로 변경
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px); // 배경 흐림 효과 추가
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const popin = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.5); opacity: 0.7; } // scale의 크기를 더 크게 조정
  100% { transform: scale(1); opacity: 1; }
`;

const blink = (color: string) => keyframes`
  0% { color: ${color};}
  50% { color: white;}
  100% { color: ${color};}
`;
export const CountDown = styled.div<{ message: string, isCountingDown: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ message }) => message === '게임 시작!' ? 'red' : 'white'};
  animation: ${popin} 1s ease-in;
  z-index: 600;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 600;
  font-size: 80px;
  justify-content: center;
  align-items: center;
  background: transparent;
  text-shadow: 
    2px 2px 0px #FFF,
    -2px -2px 0px #FFF,
    -2px 2px 0px #FFF,
    2px -2px 0px #FFF,
    20px 0px 5px rgba(0, 0, 0, 0.5);
  animation: light 1s linear infinite;
  text-align: center;
  white-space: nowrap;
  display: ${({ isCountingDown }) => isCountingDown ? 'flex' : 'none'};

  @keyframes light {
    0% { color: #3A4CA8; }
    50% { color: #657ED4; }
    100% { color: #3A4CA8; }
  }
  background-color: rgba(0, 0, 0, 0.5); // 배경색을 검정색으로 설정하고 투명도를 조금 줍니다.
  backdrop-filter: blur(5px); // 배경에 흐림 효과를 줍니다.
`;


const ModalMessage = styled.p<ModalMessageProps>`
    position: relative;
    transform: translateY(-20px);
  background: rgba( 255, 255, 255, 0.4 );
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 5.5px );
-webkit-backdrop-filter: blur( 5.5px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
  padding: 20px;
  border-radius: 20px; // 더 큰 border-radius로 변경
  width: 80%;  
  max-width: 800px; 
  text-align: center;

  color: white;
  box-shadow: 0 5px 15px 5px rgba(255, 105, 135, .3); // 더 큰 그림자로 변경
  transition: all 0.3s ease-out;
  animation: ${fadeIn} 1s ease-in;
  h2 {
    font-family: "DNFBitBitv2", sans-serif;
  font-style: bold;
  font-size: 80px;
    font-weight: 600;
    animation: ${({ color = "black" }) => css`${blink(color)} 1s infinite, ${popin} 1s ease-in`};
  animation-iteration-count: infinite, 1;
  }
  p {
    font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-size: 30px;
    font-weight: 100;
  }
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px 5px rgba(255, 105, 135, .3); // hover 시 더 큰 그림자로 변경
  }
`;

interface GameResultProps {
  score: number;
  otherScore: number;
}

export const GameResult: React.FC<GameResultProps> = ({ score, otherScore }) => {
  let result = "";
  let color = "";

  if (score > otherScore) {
    result = "승리";
    color = "green"; // 승리 시 색상
  } else if (score < otherScore) {
    result = "패배";
    color = "red"; // 패배 시 색상
  } else {
    result = "무승부";
    color = "gray"; // 무승부 시 색상
  }

  return (
    <ModalMessage id="modal-message" color={color}>
      <h2>{result}</h2>
      <p>당신의 점수: {score}</p>
      <p>상대방의 점수: {otherScore}</p>
    </ModalMessage>
  );
};
export const GoLobbyButton = styled.button<GameOverModalProps>`
  position: absolute;
  top: 60%;
  left: 30%;
  background-color: ${props => props.visible ? '#4CAF50' : 'transparent'};
  border: none;
  color: ${props => props.visible ? 'white' : 'transparent'};
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  z-index: 50;
  cursor: ${props => props.visible ? 'pointer' : 'default'};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  border-radius: 20px; // 더 큰 border-radius로 변경
  transition: background 0.3s;
  &:hover {
    background-color: ${props => props.visible ? '#45a049' : 'transparent'};
  }
`;

export const TetrisNextBlockContainer = styled.div`
position: absolute;
top: 97px;
left:472px;
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
  width: 202px;
  background: #212121;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  height: 47px;
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
  top: 10px; // 상단 정렬
  left: 100px;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 203px;
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
  top:58px;
  right:380px;
  width: 180px;
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

export const CardContainer = styled.div`
  position: absolute;
  top: 200px;
  display: flex;
  justify-content: space-around;
  padding: 20px;
  z-index: 50;
`;

export const Card = styled.div`
  width: 400px;
  height: 600px;
  margin: 0 10px;
  background: white;
  border: 1px solid white;
  box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(6px);
  border-radius: 17px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bolder;
  color: black;
  opacity: 0;
  z-index: 50;
  &:focus {
    border: 1px solid black;
    transform: scale(1.25);
    box-shadow: 0 0 10px black;
    z-index: 60;
  }
  &:not(:focus) {
    filter: blur(10px);
  }
`;


export const ItemImage = styled.img`
  width: 270px;
  height: 270px;
`;

export const OtherScore = styled.div`
  position: absolute;
  top: 80px;
  left: 340px;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 20px;
  color: #FFF;
  background: #0D7377;
  padding: 10px 20px;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  z-index: 5;
`;

export const Concentration = styled.canvas`
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: -1;
`;