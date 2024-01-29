// src/components/styles.js
import styled from 'styled-components';

export const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LogoArea = styled.div`
  width: 70%;
  height: 10%;
  margin-top: 2%;
  background: lightgray;
`;

export const SinglePlayIndicator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 10%;
  height: 5%;
  background: lightblue;
`;

export const MainTetrisArea = styled.canvas`
  width: 70%;
  height: 50%;
  background: lightgreen;
`;

export const NextBlockArea = styled.div`
  position: absolute;
  top: 10%;
  right: 0;
  width: 10%;
  height: 10%;
  background: lightyellow;
`;

export const MotionArea = styled.div`
  width: 70%;
  height: 5%;
  margin-top: 2%;
  background: lightpink;
`;

export const ScoreArea = styled.div`
  width: 70%;
  height: 5%;
  margin-top: 2%;
  background: lightcoral;
`;

export const PlayerInfoArea = styled.div`
  position: absolute;
  top: 20%;
  right: 0;
  width: 10%;
  height: 10%;
  background: lightgray;
`;

export const BackgroundArea = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
`;

export const WarningModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30%;
  height: 20%;
  background: white;
  z-index: 1;
`;

export const ModalContent = styled.p`
  /* Modal Content styles here */
`;

export const ModalButton = styled.button`
  /* Modal Button styles here */
`;
