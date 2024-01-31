// CreateRoomModal.tsx
import React, { useState } from 'react';
import {RoomModalBackground, RoomModalContainer,RoomModalActions, RoomModalButton,ModalInput,
    ModalSelect } from './styles';
import { RoomData, CreateRoomModalProps, CreatorStatuses, RoomStatuses, LockStatuses } from '../../../types/room';
import { createRoomAPI } from '../../../api/room';
import { useNavigate } from 'react-router-dom';
import { userProfileAPI } from '@api/user';
import { store } from '@app/store';
import { useDispatch } from 'react-redux';
import { drawUserInterface } from '../../../redux/roomStatus/roomStatusSlice';

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onOpen, createRoom}) => {
  const [title, setTitle] = useState('');
  const [maxCount, setMaxCount] = useState(1);
  const navigate = useNavigate();
  const currentState = store.getState();
  const dispatch = useDispatch()
  let nextRoomId = 1;

  const generateRoomId = () => {
    return nextRoomId++;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleMaxCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxCount(Number(e.target.value));
  };

  const handleCreateClick = async () => {
    const creatorProfilePic = `test/frontend/public/assets/Profile${Math.floor(Math.random() * 3) + 1}.png`; // 1~3 중 랜덤한 숫자를 선택
    const creatorNickname = await userProfileAPI(currentState.homepage.nickname);
    const backgroundUrl = `test/frontend/public/assets/RoomHeader${Math.floor(Math.random() * 3) + 1}.png`; // 1~3 중 랜덤한 숫자를 선택

    const roomData: RoomData = {
      title,
      maxCount,
      roomId: generateRoomId(),
      role: "CREATOR",
      playerstatus: CreatorStatuses.WAIT,
      currentCount: 1,
      creatorProfilePic,
      creatorNickname,
      score: 0,
      backgroundUrl,
      roomStatus: RoomStatuses.WAIT,
      isLock: LockStatuses.UNLOCK,
      players: [creatorNickname],
    };
      
    try {
      const createdRoomData:RoomData = await createRoomAPI(roomData);
      dispatch(drawUserInterface(createdRoomData));
      // onOpen(createdRoomData);
      onClose();
      createRoom(createdRoomData);
      navigate(`/rooms/${createdRoomData.roomId}`);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <RoomModalBackground>
  <RoomModalContainer>
    <ModalInput type="text" value={title} onChange={handleTitleChange} placeholder="방 제목" />
    <ModalSelect value={maxCount} onChange={handleMaxCountChange}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </ModalSelect>
    <RoomModalActions>
      <RoomModalButton onClick={handleCancelClick}>아니오</RoomModalButton>
      <RoomModalButton onClick={handleCreateClick}>예</RoomModalButton>
    </RoomModalActions>
  </RoomModalContainer>
</RoomModalBackground>
  );
};

export default CreateRoomModal;
