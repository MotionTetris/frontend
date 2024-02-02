import * as io from "socket.io-client";
import * as config from "../config";
import React, { useContext } from "react";


const loadToken = () => localStorage.getItem("token");
const token =`Bearer ${loadToken()}`;
// Socket.IO 연결 시 토큰을 auth 객체에 포함하여 전달
export const roomSocket = io.connect(config.ROOM_SOCKET_URL, {
  auth: {
    token: token,
  },
  reconnection: true, // 자동 재연결 활성화
  reconnectionAttempts: Infinity, // 재연결 시도 횟수 (무제한)
  reconnectionDelay: 1000, // 재연결 사이의 지연 시간 (ms)
  reconnectionDelayMax: 5000, // 재연결 사이의 최대 지연 시간 (ms)
  autoConnect: true, // 인스턴스 생성시 자동으로 연결 시도
});

export const RoomSocketContext = React.createContext<io.Socket | undefined>(
  undefined,
);
export const useRoomSocket = () => useContext(RoomSocketContext);

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
