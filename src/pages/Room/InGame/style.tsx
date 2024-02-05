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
  background: #4e9cad;
`;

export const SceneCanvas = styled.canvas`
    width: 600px;
    height: 800px;
    left: 0%;
    top: 100px;
    position: absolute;
`;


export const VideoContainer = styled.div`
  top: 55%;
  left: 37.7%;
  position: relative;
  width: 480px;
  height: 320px;
  background-color: #282c34;  // 어두운 회색 배경
  border: 2px solid #4B5563;  // 어두운 테두리
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);  // 그림자 효과
`;


export const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  transform: scaleX(-1);
  width: 480px;
  height: 320px;
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

