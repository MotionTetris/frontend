// RoomModal.tsx
import React from 'react';
import {RoomModalBackground, RoomModalContainer, RoomModalTitle,RoomModalContent, RoomModalActions, RoomModalButton } from './styles';
import { RoomModalProps } from '../../../types/room';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { handleRoomStatusMessage, ROOM_STATUS } from '@util/room';
// RoomModalProps
const RoomModal: React.FC<RoomModalProps> = ({ roomData, onClose,onRoomClick }) => {
  console.log(typeof onRoomClick);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    handleRoomStatusMessage(roomData, dispatch);
    if (roomData.roomStatus === ROOM_STATUS.WAITING) {
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
        <RoomModalContent>상태: {roomData.roomStatus}</RoomModalContent>
        <RoomModalActions>
      <RoomModalButton onClick={onClose}>아니오</RoomModalButton>
      <RoomModalButton onClick={() => onRoomClick(roomData)}>예</RoomModalButton>
    </RoomModalActions>
      </RoomModalContainer>
      <Link to={`/rooms/${roomData.roomid}`} onClick={handleClick}>
    </Link>
    </RoomModalBackground>
  );
};

export default RoomModal;
