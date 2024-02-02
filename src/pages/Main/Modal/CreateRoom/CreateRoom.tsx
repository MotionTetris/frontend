import { useEffect, useState } from "react";
import {
  CreateRoomBackground,
  CreateRoomContainer,
  CreateRoomActions,
  CreateRoomButton,
  CreateRoomInput,
  CreateRoomSelect,
} from "./styles";
import { useNavigate } from "react-router-dom";
import { useRoomSocket, RoomSocketEvent } from "../../../../context/roomSocket";
import { InGamePlayerCard, CreateRoomCard, LobbyGameRoomCard } from "../../../../types/Refactoring"
import { createRoomAPI } from "@api/room";

interface CreateCreateRoomProps {
  onClose: () => void;
}

const CreateRoom: React.FC<CreateCreateRoomProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [selectedOption, setSelectedOption] = useState(1);
  const {roomSocket} = useRoomSocket();
  const [createRooms, setCreateRooms] = useState<LobbyGameRoomCard[]>();

  const rodomData: CreateRoomCard = {
    roomTitle: roomName,
    creatorNickname: "", //이거 좀이따 jwt decode형태
    currentCount: 1,
    maxCount: selectedOption,
    backgroundUrl:"",
    roomStatus:"WAIT",
    isLock:"UNLOCK",
    password:""
  };


  console.assert(roomSocket, "socket is undefined");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(Number(e.target.value));
  };

  const handleCreateRoom = async() => {
    const roomInfo:LobbyGameRoomCard = await createRoomAPI(rodomData)
    setCreateRooms([...(createRooms || []), roomInfo]);
    const {roomId, creatorNickname, roomTitle} = roomInfo
    const socketStatus = {
      roomId,
      creatorNickname,
      roomTitle
    }
    roomSocket?.emit(RoomSocketEvent.EMIT_CREATE_ROOM,socketStatus);
    // socket?.on(RoomSocketEvent.ON_CREATE_ROOM);
    onClose();
    navigate("/rooms/:roomId");
  };

  return (
    <CreateRoomBackground>
      <CreateRoomContainer>
        <CreateRoomInput value={roomName} onChange={handleInputChange} />
        <CreateRoomSelect value={selectedOption} onChange={handleSelectChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </CreateRoomSelect>
        <CreateRoomActions>
          <CreateRoomButton onClick={onClose}>아니오</CreateRoomButton>
          <CreateRoomButton  onClick={handleCreateRoom}>예</CreateRoomButton>
        </CreateRoomActions>
      </CreateRoomContainer>
    </CreateRoomBackground>
  );
};

export default CreateRoom;
