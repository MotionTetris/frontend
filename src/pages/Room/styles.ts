// StyledComponents.ts
import styled from 'styled-components';

export const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
  position: relative; // 상대적 위치
`;

export const TetrisLogo = styled.div`
  width: 70%;
  height: 10%;
  background: lightgray;
`;

export const TetrisSingle = styled.div`
  position: absolute;
  top: 2%;
  right: 2%;
  width: 10%;
  height: 5%;
  background: lightblue;
`;

export const TetrisPlayer = styled.div`
  position: absolute;
  top: 10%;
  right: 2%;
  width: 10%;
  height: 10%;
  background: lightgray;
`;

export const TetrisNextBlock = styled.div`
  position: absolute;
  top: 22%;
  right: 2%;
  width: 10%;
  height: 10%;
  background: lightyellow;
`;

export const TetrisCanvas = styled.canvas`

`;

export const TetrisScore = styled.div`
  position: absolute;
  top: 2%;
  left: 25%;
  width: 20%;
  height: 5%;
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 10px;
  font-size: 1.5em; // 1.5 times the size of the default font
`;

export const MotionContainer = styled.div`
  position: absolute;
  width: 50%;
  height: 50%;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Motion = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

export const MotionDot = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const PlayerStatus = styled.button`
  position: absolute;
  bottom: 2%;
  right: 2%;
  width: 8%;
  height: 5%;
`;

