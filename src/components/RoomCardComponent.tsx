import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, RoomCardComponentProps } from '../app/store';
import { setShowStatusMessage, setStatusMessage } from '../features/roomStatus/roomStatusSlice';
import {
  RoomContainer,
  RoomBackground,
  RoomTitleContainer,
  RoomTitle,
  RoomStatus,
  RoomCreateProfile,
  RoomCreateNickname,
  RoomCount,
  StatusMessage
} from '../Styled';


const RoomCardComponent: React.FC<RoomCardComponentProps> = ({ roomData, onRoomClick }) => {
  const dispatch = useDispatch();
  const roomStatus = useSelector((state: RootState) => state.roomStatus[roomData.title] || {showStatusMessage: false, statusMessage: ''});

  // 클릭 이벤트 핸들러
  const handleClick = () => {
    if (roomData.status !== '대기 중') {
      const message = roomData.status === '준비 중' ? '준비중인 방입니다' : '게임중인 방입니다';
      dispatch(setShowStatusMessage({ roomId: roomData.title, show: true }));
      dispatch(setStatusMessage({ roomId: roomData.title, message }));
      setTimeout(() => {
        dispatch(setShowStatusMessage({ roomId: roomData.title, show: false }));
      }, 3000);
    } else {
      onRoomClick(roomData);
    }
  };

  return (
    
    <RoomContainer onClick={handleClick}>
      <RoomBackground className="room-background" style={{ backgroundImage: `url(${roomData.backgroundUrl})` }} status={roomData.status} />
      <RoomTitleContainer>
        <RoomTitle>{roomData.title}</RoomTitle>
        <RoomStatus status={roomData.status}>{roomData.status}</RoomStatus>
        <RoomCreateProfile src={roomData.creatorProfilePic} alt={`${roomData.creatorNickname}'s profile`} />
        <RoomCreateNickname>{roomData.creatorNickname}</RoomCreateNickname>
        <RoomCount>{roomData.currentCount}/{roomData.maxCount}</RoomCount>
        {/* 상태에 따른 경고 메시지 */}
        {roomStatus.showStatusMessage && (
          <StatusMessage status={roomData.status} show={roomStatus.showStatusMessage}>
            {roomStatus.statusMessage}
          </StatusMessage>
        )}
      </RoomTitleContainer>
    </RoomContainer>
  );
};

export default RoomCardComponent;
