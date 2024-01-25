// RoomModal.tsx
import React from 'react';
import {RoomModalBackground, RoomModalContainer, RoomModalTitle,RoomModalContent, RoomModalActions, RoomModalButton } from '../Styled';
import { RoomModalProps } from '../app/store';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setShowStatusMessage, setStatusMessage } from '../features/roomStatus/roomStatusSlice';

const RoomModal: React.FC<RoomModalProps> = ({ roomData, onClose,onRoomClick }) => {
  console.log(typeof onRoomClick); // 'function'이 출력되어야 정상
  const dispatch = useDispatch();

  const handleClick = () => {
    if (roomData.status !== '대기 중') {
      const message = roomData.status === '준비 중' ? '준비중인 방입니다' : '게임중인 방입니다';
      dispatch(setShowStatusMessage({ roomId: roomData.title, show: true }));
      dispatch(setStatusMessage({ roomId: roomData.title, message }));
      setTimeout(() => {
        dispatch(setShowStatusMessage({ roomId: roomData.title, show: false }));
      }, 3000);
    } else {
      onRoomClick(roomData);
    }
  };

  return (
    <RoomModalBackground onClick={onClose}>
      <RoomModalContainer onClick={(e) => e.stopPropagation()}>
        <RoomModalTitle>{roomData.title}</RoomModalTitle>
        <RoomModalContent>
          인원수: {roomData.currentCount}/{roomData.maxCount}
        </RoomModalContent>
        <RoomModalContent>상태: {roomData.status}</RoomModalContent>
        <RoomModalActions>
      <RoomModalButton onClick={onClose}>아니오</RoomModalButton>
      <RoomModalButton onClick={() => onRoomClick(roomData)}>예</RoomModalButton>
    </RoomModalActions>
      </RoomModalContainer>
      <Link to={`/rooms/${roomData.id}`} onClick={handleClick}>
      {/* Room의 내용을 렌더링하는 코드를 여기에 작성하세요. */}
    </Link>
    </RoomModalBackground>
  );
};

export default RoomModal;
