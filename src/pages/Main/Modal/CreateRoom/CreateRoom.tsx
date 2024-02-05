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
import {ROOM_BG1_URL,ROOM_BG2_URL,ROOM_BG3_URL,ROOM_BG4_URL,ROOM_BG5_URL} from "../../../../config"
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
    currentCount: 1,
    maxCount: selectedOption,
    backgroundUrl: [ROOM_BG1_URL, ROOM_BG2_URL, ROOM_BG3_URL, ROOM_BG4_URL, ROOM_BG5_URL][Math.floor(Math.random() * 5)],
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
    const roomInfo = await createRoomAPI(rodomData)
    
    setCreateRooms([...(createRooms || []), roomInfo]);
    console.log(roomInfo)
    const {message:{roomId}} = roomInfo
    roomSocket?.emit(RoomSocketEvent.EMIT_CREATE_ROOM,{roomId});
    onClose();
    navigate(`/rooms/${roomId}`);
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
