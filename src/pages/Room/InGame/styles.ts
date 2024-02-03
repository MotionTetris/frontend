import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
  padding-left: 100px;
  overflow: hidden;
`;

export const GameContainer = styled.div`
  top: 100px;
  left: 0px;
  position: relative;
  width: 600px;
  height: 800px;
`;

export const EffectCanvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const SceneCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  position: absolute;
`;

export const MessageDiv = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  color: white;
  background: rgba(255, 0, 0, 0.5);
  padding: 0px;
  font-size: 48px;
  z-index: 5;
`;

export const ScoreDiv = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  color: white;
  background: rgba(24, 100, 0, 0.5);
  padding: 10px;
  font-size: 48px;
  z-index: 5;
`;

export const NextBlockContainer = styled.div`
  position: absolute;
  width: auto;
  height: auto;
  background-color: peachpuff;
  top: 20%;
  left: 50%;
  color: black;
  font-size: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NextBlockText = styled.div`
  position: absolute;
  top: -25px;
  left: 0;
  color: black;
  font-size: 32px;
`;

export const NextBlockImage = styled.img`
  position: relative;
  top: 0px;
  width: 50%;
  height: 50%;
`;


export const VideoContainer = styled.div`
  top: 520px;
  left: 0%;
  position: relative;
  width: 480px;
  height: 320px;
  border: 2px solid black;
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