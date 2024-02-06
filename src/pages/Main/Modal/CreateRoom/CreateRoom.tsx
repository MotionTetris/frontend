import { useEffect, useState } from "react";
import {
  CreateRoomBackground,
  CreateRoomContainer,
  CreateRoomActions,
  CreateRoomYesButton,
  CreateRoomNoButton,
  CreateRoomMain,
  CreateRoomInput,
  CreateRoomSelect,
  OutlinedInputWrapper,
  OutlinedSelectWrapper
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
    const {message:{roomId}} = roomInfo;
    console.debug("방생성했따ㅏ아아: ", roomInfo);
    roomSocket?.emit(RoomSocketEvent.EMIT_CREATE_ROOM,{roomId});
    onClose();
    navigate(`/rooms/${roomId}`, { state: { roomInfo: roomInfo.message, isCreator: true } });  
  };

  return (
    <CreateRoomBackground>
      <CreateRoomContainer>
        <CreateRoomMain>방 생성</CreateRoomMain>
      <OutlinedInputWrapper>
      <input value={roomName} onChange={handleInputChange} />
      <label>방 제목</label>
    </OutlinedInputWrapper>
    <OutlinedSelectWrapper>
  <label htmlFor="roomSelect">방 인원</label> {/* 예시 레이블, 실제 내용에 맞게 조정 필요 */}
  <select id="roomSelect" value={selectedOption} onChange={handleSelectChange}>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
  </select>
</OutlinedSelectWrapper>

        <CreateRoomActions>
          <CreateRoomNoButton onClick={onClose}>아니오</CreateRoomNoButton>
          <CreateRoomYesButton  onClick={handleCreateRoom}>예</CreateRoomYesButton>
        </CreateRoomActions>
      </CreateRoomContainer>
    </CreateRoomBackground>
  );
};

export default CreateRoom;
