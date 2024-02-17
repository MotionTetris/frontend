import * as io from "socket.io-client";
import * as config from "@src/config";
import React, { useContext } from "react";
import { Socket } from "socket.io-client";
import { getToken } from "@src/data-store/token";

const loadToken = () => getToken();
export const roomSocket = (() => io.connect(config.ROOM_SOCKET_URL, {
  auth: {
    token: `Bearer ${loadToken()}`
  },
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
}))();

export const RoomSocketContext = React.createContext<Socket | undefined>(undefined);
export const useRoomSocket = () => {
  const context = useContext(RoomSocketContext);

  if (context === undefined) {
    throw new Error('useRoomSocket must be used within a RoomSocketProvider');
  }

  if (!context.connected) {
    context.auth = {token: `Bearer ${loadToken()}`}
    context.connect();
  }
  return context;
};
export enum RoomSocketEvent {
  EMIT_JOIN = "joinRoom",
  EMIT_EXIT = "leaveRoom",
  EMIT_MODIFY_ROOM = "modifyRoomInfo",
  EMIT_CREATE_ROOM = "createRoom",
  EMIT_GAME_READY = "gameReady",
  EMIT_GAME_START = "gameStart",
  EMIT_MESSAGE = "sendMessage",
  
  ON_ERROR = "error",
  ON_JOIN_ROOM = "joinUser",
  ON_MODIFY_ROOM = "modifyRoomInfo",
  ON_CREATE_ROOM = "createRoom",
  ON_GAME_START = "gameStart",
  ON_GAME_ALLREADY = "allReady",
  ON_MESSAGE = "receiveMessage",
}