// RoomModal.tsx
import React from 'react';
import {RoomModalBackground, RoomModalContainer, RoomModalTitle,RoomModalContent, RoomModalActions, RoomModalButton } from './styles';
import { RoomModalProps } from '../../../types/room';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { handleRoomStatusMessage } from '@util/room';
import { RoomStatuses } from '../../../types/room'
// RoomModalProps
const RoomModal: React.FC<RoomModalProps> = ({ roomData, onClose,onRoomClick }) => {
  console.log(typeof onRoomClick);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    handleRoomStatusMessage(roomData, dispatch);
    if (roomData.roomStatus === RoomStatuses.WAIT) {
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
        <RoomModalContent>상태: {
    roomData.roomStatus === 'WAIT' ? '대기 중' :
    roomData.roomStatus === 'READY' ? '준비 중' :
    roomData.roomStatus === 'START' ? '게임 중' :
    '상태 정보 없음'
  }</RoomModalContent>
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
