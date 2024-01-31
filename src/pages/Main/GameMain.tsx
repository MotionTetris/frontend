import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@app/store';
import { RoomData } from '../../types/room';
import { fetchRooms, setCurrentPage, openModal, closeModal } from '../../redux/game/gameSlice';
import HeaderComponent from '@components/Header/HeaderComponent';
import RoomCardComponent from '@components/Room/RoomCardComponent';
import RoomModal from '@components/Room/Modal/RoomModal';
import { GameRoomGrid, GamePagination, GameContainer , GamePaginationButton, CreateRoomButton } from './styles';
import { useNavigate } from 'react-router-dom';
import { RoomsdataAPI } from '@api/room';
import { goToPreviousPage, goToNextPage } from '@util/pagination';
import { useSocketIO } from '../../api/WebSocket/useSocketIO'; // useSocketIO 훅 import
import RoomCreate from '@components/Room/Modal/RoomCreate'

const GameMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, currentPage, isModalOpen, selectedRoom } = useSelector((state: RootState) => state.game);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const activePath = '/gamemain';
  const roomsPerPage = 6;
  const navigate = useNavigate();

   const {joinUser, createRoom} = useSocketIO('localhost:3001');

   const handleCreateRoomClick = () => {
    setIsCreateRoomModalOpen(true); 
  };
  
  const handleCloseCreateRoomModal = () => {
    setIsCreateRoomModalOpen(false);
  };

  
  useEffect(() => {
    RoomsdataAPI(currentPage)
    dispatch(fetchRooms(currentPage))
  }, [dispatch, currentPage]);

  const handleRoomClick = (roomData: RoomData) => {
    dispatch(openModal(roomData));
  };

  const handleRoomEnter = (roomData: RoomData) => {
    console.log('Attempting to join room', roomData.roomId); 
    navigate(`/rooms/${roomData.roomId}`);
    joinUser(roomData.roomId);  // 'joinUser' 이벤트 발생
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

const currentRooms = rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  return (
    <GameContainer>
      <HeaderComponent activePath={activePath}/>
      <CreateRoomButton onClick={handleCreateRoomClick}>방 생성</CreateRoomButton>
      <GameRoomGrid>
        {currentRooms.map((roomData, index) => (
          <RoomCardComponent
            key={index}
            roomData={roomData}
            onRoomClick={handleRoomClick}
          />
        ))}
      </GameRoomGrid>
      {isCreateRoomModalOpen && (
    <RoomCreate onOpen={handleCreateRoomClick} onClose={handleCloseCreateRoomModal} createRoom={createRoom}/>  // 방 생성 모달 추가
)}
      {isModalOpen && selectedRoom && (
        <RoomModal roomData={selectedRoom} onClose={handleCloseModal} onRoomClick={handleRoomEnter}/>
      )}
        <GamePagination>
        <GamePaginationButton direction="left" onClick={() => goToPreviousPage(currentPage, dispatch, setCurrentPage)} disabled={currentPage === 1} />
        <GamePaginationButton direction="right" onClick={() => goToNextPage(currentPage, totalPages, dispatch, setCurrentPage)} disabled={currentPage === totalPages} />
      </GamePagination>
    </GameContainer>
  );
};

export default GameMain;
