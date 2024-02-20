// CreateRoom
import styled from "styled-components";
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
  border-radius: 10px;
  width: 30%;
  height: 45%;
  max-width: 600px;
`;

export const RoomLabel = styled.label`
  // 여기에 CSS 스타일을 추가합니다.
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
  width: 80px;
  height: 30px;
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
  top: 9vh;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
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
    font-size: 1.3em;
  }
  
  & label {
    position: absolute;
    left: 10px;
    top: -10px;
    background: #fff;
    padding: 0 5px;
    font-size: 1em;
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
  top:27vh;

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
    font-size: 1.3em;
  }

  &:hover,
  &:focus-within {
    border-color: red;
  }

  & label {
    position: absolute;
    left: 10px;
    top: 0px;
    z-index: 10;
    background: #fff;
    padding: 0 5px;
    font-size: 1em;
    pointer-events: none;
    transition: 0.2s;
    color: #000;
    transform: translate(0, -50%);
  }
`;


