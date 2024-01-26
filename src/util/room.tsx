import { Dispatch } from 'redux';
import { setShowStatusMessage, setStatusMessage } from '@features/roomStatus/roomStatusSlice';

export const ROOM_STATUS = {
  WAITING: '대기 중',
  PREPARING: '준비 중',
  IN_GAME: '게임 중',
};

export const handleRoomStatusMessage = (roomData: any, dispatch: Dispatch) => {
    if (roomData.status !== ROOM_STATUS.WAITING) {
      const message = roomData.status === ROOM_STATUS.PREPARING ? '준비중인 방입니다' : '게임중인 방입니다';
      dispatch(setShowStatusMessage({ roomId: roomData.title, show: true }));
      dispatch(setStatusMessage({ roomId: roomData.title, message }));
      setTimeout(() => {
        dispatch(setShowStatusMessage({ roomId: roomData.title, show: false }));
      }, 3000);
    }
  };