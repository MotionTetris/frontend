// RoomModal.tsx
import React from 'react';
import styled from 'styled-components';

// 모달 스타일 정의
const ModalBackground = styled.div`
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

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  max-width: 600px;
`;

const ModalTitle = styled.h2``;

const ModalContent = styled.p``;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
`;

type RoomModalProps = {
  roomData: RoomData;
  onClose: () => void;
};

const RoomModal: React.FC<RoomModalProps> = ({ roomData, onClose }) => {
  return (
    <ModalBackground onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{roomData.title}</ModalTitle>
        <ModalContent>
          인원수: {roomData.currentCount}/{roomData.maxCount}
        </ModalContent>
        <ModalContent>상태: {roomData.status}</ModalContent>
        <ModalActions>
          <Button onClick={onClose}>아니오</Button>
          <Button onClick={() => {/* 룸 입장 로직 */}}>예</Button>
        </ModalActions>
      </ModalContainer>
    </ModalBackground>
  );
};

export default RoomModal;
