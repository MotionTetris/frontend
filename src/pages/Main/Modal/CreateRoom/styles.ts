// CreateRoom
import styled from "styled-components";
import ROOM_BG1_URL from "../../../../../public/assets/Gameroom1.png";

export const CreateRoomBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const CreateRoomContainer = styled.div`
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center;
  position: relative;
  top: 0vh;
  right: 0;
  background: white;
  border: 3px solid #BFEFFF;  // 연한 파란색보다 조금 더 하얗게
  border-radius: 20px;  // 테두리 반경 20px
  width: 30%;
  height: 48%;
  max-width: 600px;
`;
export const RoomLabel = styled.label`
  font-size: 46px;
`;

export const Line = styled.div`
  position: fixed;
  top: 250px;
  right: 670px;
  width: 12%;
  height: 12%;
  background: url(${ROOM_BG1_URL}) no-repeat center center; // 배경 이미지 적용 및 위치 조정
  background-size: cover; // 배경 이미지 크기 조정
`;

export const BG = styled.div`
  position: absolute;
  top: 125px;
  right: 40px;
  width: 500px;
  border: 1px solid rgba(128, 128, 128, 0.5);
`;

export const RoomInput = styled.input`
  // 여기에 CSS 스타일을 추가합니다.
`;

export const RoomSelect = styled.select`
  // 여기에 CSS 스타일을 추가합니다.
`;

export const WarningMessage = styled.span`
  color: red;
  white-space: nowrap;
`;


export const CreateRoomTitle = styled.h2``;

export const CreateRoomContent = styled.p``;

export const CreateRoomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const CreateRoomYesButton = styled.button`
  position: absolute;
  bottom: 3vh;
  right: 2vw;
  background-color: blue;
  color: white;
  border: 2px solid #0000FF;
  border-radius: 5px;
  transition: box-shadow 0.3s;
  width: 80px;
  height: 30px;
  font-size: 24px;
  font-family: 'MaplestoryOTFBold';
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 255, 0.2);
  }
`;

export const CreateRoomNoButton = styled.button`
  position: absolute;
  bottom: 3vh;
  right: 10vw;
  background-color: transparent;
  border-radius: 5px;
  color: blue;
  border: none;
  transition: box-shadow 0.3s;
  width: 120px;
  height: 30px;
  font-size: 24px;
  font-family: 'MaplestoryOTFBold';
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 255, 0.2);
  }
`;

export const CreateRoomInput = styled.input`
  position: absolute;
  bottom: 0vh;
  right: 8vw;
  display: block;
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  position: relative;
  outline: none;
  transition: all 0.3s;

  &:hover,
  &:focus {
    border-color: lightblue;
  }

  &::placeholder {
    color: #000;
  }
`;


export const CreateRoomSelect = styled.select`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

export const CreateRoomMain = styled.span`
  position: absolute;
  top: 8vh;
  left: 22%;
  transform: translate(-50%, -50%);
  font-weight: normal;
  font-style: normal;
  font-size: 60px;
  text-align: center;
`;

export const OutlinedInputWrapper = styled.div`
  display: inline-block;
  margin-bottom: 10px;
  width: 90%;
  position: absolute;
  top: 18vh;

  &:hover,
    &:focus {
      border-color: red;
    }
  & input {
    box-sizing: border-box;
    padding: 15px;
    width: 100%;
    border: 1px solid #000;
    border-radius: 10px;
    font-size: 2em;
  }
  
  & label {
    position: absolute;
    left: 10px;
    top: -30px;
    background: #fff;
    padding: 0 5px;
    font-size: 2em;
    pointer-events: none;
    transition: 0.2s;
    color: #000;
  }
`;

export const OutlinedSelectWrapper = styled.div`
  display: inline-block;
  margin-bottom: 10px;
  width: 90%;
  position: absolute;
  top:32vh;

  & select {
    box-sizing: border-box;
    border: 1px solid #000;
    padding: 15px;
    width: 100%;
    border-radius: 10px;
    -webkit-appearance: none; 
    -moz-appearance: none;
    appearance: none;
    position: relative;
    background-color: white;
    font-size: 2em;
  }

  &:hover,
  &:focus-within {
    border-color: red;
  }

  & label {
    position: absolute;
    left: 10px;
    top: -10px;
    z-index: 10;
    background: #fff;
    padding: 0 5px;
    font-size: 2em;
    pointer-events: none;
    transition: 0.2s;
    color: #000;
    transform: translate(0, -50%);
  }
`;


