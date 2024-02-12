import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justifyContent: center;
    alignItems: center;
    height: 100vh;
    overflow: hidden;
`;

export const UserNickName = styled.div`
  position: relative;
  top: 0px;
  left: 350px;
  color: black;

  padding: 0px;
  font-size: 36px;
  z-index: 5;
`;

export const Score = styled.div`
  position: relative;
  top: -35px;  
  left: 20px;
  color: black;
  padding: 0px;
  font-size: 48px;
  z-index: 5;

`;

export const SceneContainer = styled.div`
  top: 0%;
  left: 0%;
  width: 600px;
  height: 900px;
  position: absolute;
  background: rgba(78, 156, 173, 1);
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
  height: 900px;
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
  top: 55%;
  left: 57.5%;
  position: relative;
  width: 450px;
  height: 300px;
  
`;


export const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  transform: scaleX(-1);
  width: 100%;
  height: 100%;
`;

export const VideoCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 480px;
  height: 320px;
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
  transform: translate(-50%, -50%);  // 추가된 코드
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