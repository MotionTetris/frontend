import { Dispatch } from "redux";
import {
  setShowStatusMessage,
  setStatusMessage,
} from "@redux/roomStatus/roomStatusSlice";
import { RoomStatuses } from "@type/room";

export const handleRoomStatusMessage = (roomData: any, dispatch: Dispatch) => {
  // `roomData.status` 대신 `roomData.roomStatus`를 사용
  if (roomData.roomStatus !== RoomStatuses.WAIT) {
    const message =
      roomData.roomStatus === RoomStatuses.READY
        ? "준비중인 방입니다"
        : "게임중인 방입니다";
    dispatch(setShowStatusMessage({ roomId: roomData.title, show: true }));
    dispatch(setStatusMessage({ roomId: roomData.title, message }));
    setTimeout(() => {
      dispatch(setShowStatusMessage({ roomId: roomData.title, show: false }));
    }, 3000);
  }
};
