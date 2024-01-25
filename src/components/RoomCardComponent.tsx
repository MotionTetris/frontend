import React from 'react';
import { RoomContainer, RoomBackground, RoomTitleContainer, RoomTitle, RoomStatus, RoomCreateProfile, RoomCreateNickname, RoomCount, StatusMessage } from '../Styled';
import {  useState } from 'react';
// RoomData 타입 정의
type RoomData = {
  title: string;
  status: string;
  creatorProfilePic: string;
  creatorNickname: string;
  currentCount: number;
  maxCount: number;
  backgroundUrl: string;
};

type RoomCardComponentProps = {
  roomData: RoomData; // Props로 roomData를 받음
  onRoomClick: (roomData: RoomData) => void; // 클릭 이벤트 함수 추가
};

const RoomCardComponent: React.FC<RoomCardComponentProps> = ({ roomData, onRoomClick }) => {
// 상태 메시지 표시 여부를 위한 state
const [showStatusMessage, setShowStatusMessage] = useState(false);

// 클릭 이벤트 핸들러
const handleClick = () => {
  if (roomData.status !== '대기 중') {
    setShowStatusMessage(true); // 상태 메시지 표시
    setTimeout(() => {
      setShowStatusMessage(false); // 3초 후 상태 메시지 숨김
    }, 3000);
  } else {
    onRoomClick(roomData);
  }
};

  return (
    <RoomContainer onClick={handleClick}>
      <RoomBackground className="room-background" style={{ backgroundImage: `url(${roomData.backgroundUrl})` }} status={roomData.status}>
      </RoomBackground>
      <RoomTitleContainer>
        <RoomTitle>{roomData.title}</RoomTitle>
        <RoomStatus status={roomData.status}>{roomData.status}</RoomStatus>
        <RoomCreateProfile src={roomData.creatorProfilePic} alt={`${roomData.creatorNickname}'s profile`} />
        <RoomCreateNickname>{roomData.creatorNickname}</RoomCreateNickname>
        <RoomCount>{roomData.currentCount}/{roomData.maxCount}</RoomCount>
        {/* 상태에 따른 경고 메시지 */}
        {showStatusMessage && (
       <StatusMessage status={roomData.status} show={showStatusMessage}>
          {roomData.status === '준비 중' ? '준비중인 방입니다' : '게임중인 방입니다'}
        </StatusMessage>
      )}
      </RoomTitleContainer>
    </RoomContainer>
  );
};

export default RoomCardComponent;
