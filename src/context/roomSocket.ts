import * as io from "socket.io-client";
import * as config from "../config";
import React, { useContext } from "react";

const loadToken = () => localStorage.getItem("token");
// Socket.IO 연결 시 토큰을 auth 객체에 포함하여 전달
export const createRoomSocket = ():io.Socket => {

  const token =`Bearer ${loadToken()}`;

  return io.connect(config.ROOM_SOCKET_URL, {
    auth: {
      token
    },
  });
};

export type RoomSocketContextType = {
  roomSocket: io.Socket | null;
  setRoomSocket: React.Dispatch<React.SetStateAction<io.Socket | null>>;
}

export const RoomSocketContext = React.createContext<RoomSocketContextType| undefined>(
  undefined,
);
export const useRoomSocket = () => {
  const context = useContext(RoomSocketContext);

  if (context === undefined) {
    throw new Error('useRoomSocket must be used within a RoomSocketProvider');
  }

  return context;
};
export enum RoomSocketEvent {
  EMIT_JOIN = "joinRoom",
  EMIT_EXIT = "leaveRoom",
  EMIT_MODIFY_ROOM = "modifyRoomInfo",
  EMIT_CREATE_ROOM = "createRoom",
  EMIT_GAME_START = "gameStart",
  ON_ERROR = "error",
  ON_JOIN_ROOM = "joinUser",
  ON_MODIFY_ROOM = "modifyRoomInfo",
  ON_CREATE_ROOM = "createRoom",
  ON_GAME_START = "gameStart"
}