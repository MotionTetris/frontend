import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
`;

export const GameContainer = styled.div`
  position: relative;
  width: 600px;
  height: 800px;
`;

export const EffectCanvas = styled.canvas`
  position: absolute;
  width: 600px;
  height: 800px;
`;

export const SceneCanvas = styled.canvas`
  width: 600px;
  height: 800px;
  position: absolute;
`;

export const MessageDiv = styled.div`
  position: absolute;
  top: 90%;
  left: 25%;
  color: white;
  background: rgba(255, 0, 0, 0.5);
  padding: 0px;
  font-size: 48px;
`;

export const ScoreDiv = styled.div`
  position: absolute;
  top: 0;
  left: 30%;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  font-size: 48px;
`;

export const VideoContainer = styled.div`
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
