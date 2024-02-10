import {
  RoomInfoBackground,
  RoomInfoContainer,
  RoomInfoTitle,
  RoomInfoContent,
  RoomInfoActions,
  RoomInfoButton,
} from "./styles";
import { useNavigate } from "react-router-dom";
import { LobbyGameRoomCard } from "@type/Refactoring";
import { RoomStatuses } from "@type/RefactoringStatuses";
import { useRoomSocket, RoomSocketEvent } from "@context/roomSocket";

interface RoomInfoProps {
  roomData: LobbyGameRoomCard;
  onCloseModal: () => void;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomData, onCloseModal }) => {
  const navigate = useNavigate();
  const roomSocket = useRoomSocket();

  const handleYesClick = () => {
    roomSocket?.emit(RoomSocketEvent.EMIT_JOIN,{ roomId: roomData.roomId });
    navigate(`/rooms/${roomData.roomId}`, { state: { roomInfo: roomData, isCreator: false } });
  };
  const handleNoClick = () => {
    if (onCloseModal) onCloseModal();
  };
  return (
    <RoomInfoBackground>
      <RoomInfoContainer>
        <RoomInfoTitle>{roomData.roomTitle}</RoomInfoTitle>
        <RoomInfoContent>
          인원수: {roomData.currentCount}/{roomData.maxCount}
        </RoomInfoContent>
        <RoomInfoContent>
          {RoomStatuses[roomData.roomStatus] || "상태 정보 없음"}
        </RoomInfoContent>
        <RoomInfoActions>
          <RoomInfoButton onClick={handleNoClick}>아니오</RoomInfoButton>
          <RoomInfoButton onClick={handleYesClick}>예</RoomInfoButton>
        </RoomInfoActions>
      </RoomInfoContainer>
    </RoomInfoBackground>
  );
};
export default RoomInfo;
