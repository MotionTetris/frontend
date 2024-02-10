import { useEffect, useState } from "react";
import RoomCardComponent from "@components/Room/RoomCardComponent";
import {
  GameRoomGrid,
  GamePagination,
  GameContainer,
  GamePaginationButton,
  CreateRoomButton,
} from "./styles";
import CreateRoom from "./Modal/CreateRoom/CreateRoom";
import { LobbyGameRoomCard } from "@type/Refactoring";
import { useRoomSocket } from "@context/roomSocket";
import RoomInfo from "../Main/Modal/RoomInfo/RoomInfo";
import { requestRoomAPI } from "@api/room";
import { Navigate } from "react-router-dom";
import { getToken } from "@src/data-store/token";
import { Spinner } from "@src/components/Common/Spinner";

const GameMain = () => {
  const [rooms, setRooms] = useState<LobbyGameRoomCard[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] =
    useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<LobbyGameRoomCard | null>(
    null,
  );
  const [isRoomInfoModalOpen, setIsRoomInfoModalOpen] =
    useState<boolean>(false);
  const roomsPerPage = 6; // 한 페이지에 표시될 방의 개수
  const currentRooms = rooms.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage,
  );

  const handleRoomCardClick = (room: LobbyGameRoomCard) => {
    setSelectedRoom(room);
    setIsRoomInfoModalOpen(true);
  };

  const handleCloseRoomInfoModal = () => {
    setIsRoomInfoModalOpen(false);
    setSelectedRoom(null);
  };

  const handleCreateRoomClick = () => {
    setIsCreateRoomModalOpen(true);
  };

  const handleCloseCreateRoomModal = () => {
    setIsCreateRoomModalOpen(false);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevCurrentPage) =>
      Math.min(prevCurrentPage + 1, totalPages),
    );
  };

  let roomSocket = useRoomSocket();
  console.assert(roomSocket, "socket is undefined");

  if (!roomSocket || !roomSocket.connected) {
    alert("게임 서버와의 연결에 실패하였습니다!");
    return <Navigate to="/" replace></Navigate>
  }

  useEffect(() => {
    (async()=>{
      const rooms = await requestRoomAPI()
      setRooms(rooms||[])
      console.log(rooms)
    })();
    return () => {
    };
  }, [rooms.length]);

  useEffect(() => {
    const total = Math.ceil(rooms.length / roomsPerPage);
    setTotalPages(total);
  }, [rooms.length]);

  return (
    <GameContainer>
      <CreateRoomButton onClick={handleCreateRoomClick}>
        + 방 생성
      </CreateRoomButton>
      <GameRoomGrid>
        {currentRooms.map((room) => (
          <RoomCardComponent
            key={room.roomId}
            roomData={room}
            onRoomClick={handleRoomCardClick}
          />
        ))}
      </GameRoomGrid>
      {isCreateRoomModalOpen && (
        <CreateRoom onClose={handleCloseCreateRoomModal} />
      )}
      {isRoomInfoModalOpen && selectedRoom && (
        <RoomInfo
          roomData={selectedRoom}
          onCloseModal={handleCloseRoomInfoModal}
        />
      )}
      <GamePagination>
        <GamePaginationButton
          direction="left"
          onClick={() => goToPreviousPage()}
          disabled={currentPage === 1}
        />
        <GamePaginationButton
          direction="right"
          onClick={() => goToNextPage()}
          disabled={currentPage === totalPages}
        />
      </GamePagination>
    </GameContainer>
  );
};

export default GameMain;
