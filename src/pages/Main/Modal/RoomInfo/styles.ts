// RoomInfo
import styled from "styled-components";
export const RoomInfoBackground = styled.div`
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

export const RoomInfoContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  max-width: 600px;
`;

export const RoomInfoTitle = styled.h2`
  font-size: 32px;
`;

export const RoomInfoContent = styled.p`
  font-size: 32px;
`;

export const RoomInfoActions = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: 'MaplestoryOTFBold';
  margin-top: 20px;
`;

export const RoomInfoButton = styled.button`
  padding: 10px 20px;
  font-family: 'MaplestoryOTFBold';
  margin-left: 10px;
  font-size: 24px;
`;

// 새로운 컴포넌트를 위한 스타일 추가
export const ModalInput = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

// 새로운 컴포넌트를 위한 스타일 추가
export const ModalSelect = styled.select`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;
