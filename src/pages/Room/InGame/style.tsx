import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justifyContent: center;
    alignItems: center;
    height: 100vh;
    overflow: hidden;
`;

export const SceneCanvas = styled.div`
    width: 600px;
    height: 800px;
    left: 0%;
    top: 0%;
    position: absolute;
`;

export const EffectCanvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
`;



export const VideoContainer = styled.div`
  top: 400px;
  left: 20%;
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


export const MessageDiv = styled.div`
  position: absolute;
  top: 10%;
  left: 47%;
  color: white;
  background: rgba(255, 0, 0, 0.5);
  padding: 0px;
  font-size: 48px;
  z-index: 5;
`;