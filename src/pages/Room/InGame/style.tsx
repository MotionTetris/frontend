import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const UserNickName = styled.div`
  position: absolute;
  top: 5px;
  left: 20%;
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
  top: 5px;
  left: 60%;
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

export const  UserBackGround = styled.div`
  width: 100%;
  height: 100%;

`;


export const VideoContainer = styled.div`
  position: relative;
  top: 10vh;
  left: 25vw;
  width: 30vw;
  height: 100vh;
  border: 2px solid black;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;


export const Video = styled.video`
  position: absolute;
  top: 10vh;
  left: 0vw;
  width: 30vw;
  height: 90vh;
  object-fit: cover;
`;

export const VideoCanvas = styled.canvas`
  position: absolute;
  top: 10vh;
  left: 0vw;
  width: 30vw;
  height: 90vh;
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
  transform: translate(-50%, -50%);  // 추가된 코드
`;

