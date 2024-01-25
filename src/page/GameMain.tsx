// src/components/GameMain.tsx

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, RoomData } from '../app/store';
import { fetchRooms, setCurrentPage, openModal, closeModal } from '../features/game/gameSlice';
import HeaderComponent from '../components/HeaderComponent';
import RoomCardComponent from '../components/RoomCardComponent';
import RoomModal from '../Modal/RoomModal';
import { RoomGrid, Pagination, GameMainContainer , PaginationButton } from '../Styled';
import { useNavigate } from 'react-router-dom';


const GameMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, currentPage, isModalOpen, selectedRoom } = useSelector((state: RootState) => state.game);
  const activePath = '/gamemain';
  const roomsPerPage = 6; // 한 페이지당 방 개수
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchRooms(currentPage));
  }, [dispatch, currentPage]);

  const handleRoomClick = (roomData: RoomData) => {
    dispatch(openModal(roomData));
  };

  const handleRoomEnter = (roomData: RoomData) => {
    navigate(`/rooms/${roomData.id}`);
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

// rooms 배열에서 현재 페이지에 해당하는 항목들만 추출
const currentRooms = rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  // 이전 페이지로 이동하는 함수
  const goToPreviousPage = () => {
    dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));
  };

  // 다음 페이지로 이동하는 함수
  const goToNextPage = () => {
    dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)));
  };
  return (
    <GameMainContainer>
      <HeaderComponent activePath={activePath}/>
      <RoomGrid>
        {currentRooms.map((roomData, index) => (
          <RoomCardComponent
            key={index}
            roomData={roomData}
            onRoomClick={handleRoomClick}
          />
        ))}
      </RoomGrid>
      {isModalOpen && selectedRoom && (
        <RoomModal roomData={selectedRoom} onClose={handleCloseModal} onRoomClick={handleRoomEnter}/>
      )}
        <Pagination>
        < PaginationButton direction="left" onClick={goToPreviousPage} disabled={currentPage === 1} />
        < PaginationButton direction="right" onClick={goToNextPage} disabled={currentPage === totalPages} />
      </Pagination>
    </GameMainContainer>
  );
};

export default GameMain;
