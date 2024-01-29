import { useSelector, useDispatch } from 'react-redux';
import { RoomCardComponentProps,RoomState } from '../../types/room';
import { handleRoomStatusMessage, ROOM_STATUS } from '@util/room';
import {
  RoomContainer,
  RoomBackground,
  RoomTitleContainer,
  RoomTitle,
  RoomStatus,
  RoomCreateProfile,
  RoomCreateNickname,
  RoomCount,
  RoomStatusMessage
} from './styles';

const RoomCardComponent: React.FC<RoomCardComponentProps> = ({ roomData, onRoomClick }) => {
  const dispatch = useDispatch();
  const roomStatus = useSelector((state: RoomState) => state.roomStatus[roomData.title] || {showStatusMessage: false, statusMessage: ''});

  const handleClick = () => {
    handleRoomStatusMessage(roomData, dispatch);
    if (roomData.roomStatus === ROOM_STATUS.WAITING) {
      onRoomClick(roomData);
    }
  };

  return (
    <RoomContainer onClick={handleClick}>
      <RoomBackground className="room-background" style={{ backgroundImage: `url(${roomData.backgroundUrl})` }} status={roomData.roomStatus} />
      <RoomTitleContainer>
        <RoomTitle>{roomData.title}</RoomTitle>
        <RoomStatus status={roomData.roomStatus}>{roomData.roomStatus}</RoomStatus>
        <RoomCreateProfile src={roomData.creatorProfilePic} alt={`${roomData.creatorNickname}'s profile`} />
        <RoomCreateNickname>{roomData.creatorNickname}</RoomCreateNickname>
        <RoomCount>{roomData.currentCount}/{roomData.maxCount}</RoomCount>
        {roomStatus.showStatusMessage && (
          <RoomStatusMessage status={roomData.roomStatus} show={roomStatus.showStatusMessage}>
            {roomStatus.statusMessage}
          </RoomStatusMessage>
        )}
      </RoomTitleContainer>
    </RoomContainer>
  );
};

export default RoomCardComponent;
