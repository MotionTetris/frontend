// GameMain.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import RoomCardComponent from '../components/RoomCardComponent';
import RoomModal from '../Modal/RoomModal'; // RoomModal 컴포넌트 import
import { RoomGrid, Pagination, GameMainContainer } from '../Styled'; // Styled.tsx에 정의할 RoomGrid와 Pagination 스타일 추가

// RoomData 타입 정의
type RoomData = {
  title: string;
  status: string;
  creatorProfilePic: string;
  creatorNickname: string;
  currentCount: number;
  maxCount: number;
  backgroundUrl: string; // 배경 이미지 URL 추가
};

const GameMain = () => {
  const [activePath] = useState('/gamemain');
  const [rooms, setRooms] = useState<RoomData[]>([]); // 여러 방의 데이터를 저장할 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const roomsPerPage = 9; // 한 페이지당 방 개수
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  const openModal = (roomData: RoomData) => {
    setSelectedRoom(roomData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  useEffect(() => {
  const fetchRooms = async () => {
    try {
      const response = await axios.get<{ rooms: RoomData[] }>('/api/room-data', {
        params: {
          page: currentPage,
          limit: roomsPerPage
        }
      });
      console.log('받은 데이터:', response.data.rooms); // 응답 데이터 로깅
      setRooms(response.data.rooms); // 서버 응답에서 rooms 배열을 사용
    } catch (error) {
      console.error('방 정보를 가져오는데 실패했습니다.', error);
    }
  };

  fetchRooms();
}, [currentPage]);


  // 페이지네이션을 위한 함수들
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <GameMainContainer>
      <HeaderComponent activePath={activePath}/>
      <RoomGrid>
        {rooms.map((roomData, index) => (
            <RoomCardComponent
            key={index}
            roomData={roomData}
            onRoomClick={openModal} // 클릭 이벤트 함수 전달
          />
        ))}
      </RoomGrid>
      {isModalOpen && selectedRoom && (
        <RoomModal roomData={selectedRoom} onClose={closeModal} />
      )}
      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button key={pageNumber} onClick={() => changePage(pageNumber)}>
            {pageNumber}
          </button>
        ))}
      </Pagination>
    </GameMainContainer>
  );
};

export default GameMain;
