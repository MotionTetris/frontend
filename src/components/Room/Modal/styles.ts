// RoomModal
import styled from 'styled-components';
export const RoomModalBackground = styled.div`
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

export const RoomModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  max-width: 600px;
`;

export const RoomModalTitle = styled.h2``;

export const RoomModalContent = styled.p``;

export const RoomModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const RoomModalButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
`;