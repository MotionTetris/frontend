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
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  max-width: 600px;
`;

export const CreateRoomTitle = styled.h2``;

export const CreateRoomContent = styled.p``;

export const CreateRoomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const CreateRoomButton = styled.button`
  padding: 10px 20px;

  margin-left: 10px;
`;
export const CreateRoomInput = styled.input`
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

export const OutlinedInputWrapper = styled.div`
  display: inline-block;
  margin-bottom: 10px;
  width: 100%;
  position: relative;

  &:hover,
    &:focus {
      border-color: red;
    }
  & input {
    border: none;
    padding: 10px;
    width: 90%;
    border: 1px solid #000;
    border-radius: 10px;
  }
  
  & label {
    position: absolute;
    left: 10px;
    top: -10px;
    background: #fff;
    padding: 0 5px;
    font-size: 0.75em;
    pointer-events: none;
    transition: 0.2s;
    color: #000;
  }
`;