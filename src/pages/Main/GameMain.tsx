import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@app/store';
import { RoomData } from '../../types/room';
import { fetchRooms, setCurrentPage, openModal, closeModal } from '@features/game/gameSlice';
import HeaderComponent from '@components/Header/HeaderComponent';
import RoomCardComponent from '@components/Room/RoomCardComponent';
import RoomModal from '@components/Room/Modal/RoomModal';
import { GameRoomGrid, GamePagination, GameContainer , GamePaginationButton } from './styles';
import { useNavigate } from 'react-router-dom';
import { RoomsdataAPI } from '@api/room';
import { goToPreviousPage, goToNextPage } from '@util/pagination';

const GameMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, currentPage, isModalOpen, selectedRoom } = useSelector((state: RootState) => state.game);
  const activePath = '/gamemain';
  const roomsPerPage = 6;
  const navigate = useNavigate();
    useEffect(() => {
    RoomsdataAPI(currentPage)
    dispatch(fetchRooms(currentPage))
  }, [dispatch, currentPage]);

  const handleRoomClick = (roomData: RoomData) => {
    dispatch(openModal(roomData));
  };

  const handleRoomEnter = (roomData: RoomData) => {
    navigate(`/rooms/${roomData.roomid}`);
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

const currentRooms = rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  return (
    <GameContainer>
      <HeaderComponent activePath={activePath}/>
      <GameRoomGrid>
        {currentRooms.map((roomData, index) => (
          <RoomCardComponent
            key={index}
            roomData={roomData}
            onRoomClick={handleRoomClick}
          />
        ))}
      </GameRoomGrid>
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
