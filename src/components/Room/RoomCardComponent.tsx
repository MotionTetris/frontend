import { LobbyGameRoomCard } from "../../types/Refactoring";
import { RoomStatuses } from "../../types/RefactoringStatuses";
import {
  RoomContainer,
  RoomBackground,
  RoomTitleContainer,
  RoomTitle,
  RoomStatus,
  RoomCreateNickname,
  RoomCount,
  RoomId,
} from "./styles";

interface RoomCardComponentProps {
  roomData: LobbyGameRoomCard;
  onRoomClick: (roomData: LobbyGameRoomCard) => void;
}

const RoomCardComponent: React.FC<RoomCardComponentProps> = ({
  roomData,
  onRoomClick,
}) => {
  return (
    <RoomContainer onClick={() => onRoomClick(roomData)}>
      <RoomBackground
        className="room-background"
        style={{ backgroundImage: `url(${roomData.backgroundUrl})` }}
        status={roomData.roomStatus}
      />
      <RoomTitleContainer>
        <RoomId>{roomData.roomId}</RoomId>
        <RoomTitle>{roomData.roomTitle}</RoomTitle>
        <RoomStatus status={roomData.roomStatus}>
          {RoomStatuses[roomData.roomStatus] || "상태 정보 없음"}
        </RoomStatus>
        <RoomCreateNickname>{roomData.creatorNickname}</RoomCreateNickname>
        <RoomCount>
          {roomData.currentCount}/{roomData.maxCount}
        </RoomCount>
      </RoomTitleContainer>
    </RoomContainer>
  );
};

export default RoomCardComponent;
