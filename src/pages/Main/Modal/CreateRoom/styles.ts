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
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

export const CreateRoomSelect = styled.select`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;
