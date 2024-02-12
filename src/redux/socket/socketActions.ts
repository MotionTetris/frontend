import { RoomData } from "@type/room";

export const SET_SOCKET_STATUS = "SET_SOCKET_STATUS";
export const SOCKET_CONNECTED = "SOCKET_CONNECTED";
export const SOCKET_DISCONNECTED = "SOCKET_DISCONNECTED";
export const ROOM_CREATED = "ROOM_CREATED";
export const USER_JOINED = "USER_JOINED";
export const ROOM_INFORMATION = "ROOM_INFORMATION";

export const setSocketStatus = (status: boolean) => ({
  type: SET_SOCKET_STATUS,
  payload: status,
});

export const socketConnected = () => ({
  type: SOCKET_CONNECTED,
});

export const socketDisconnected = () => ({
  type: SOCKET_DISCONNECTED,
});

export const roomCreated = (data: RoomData) => ({
  type: ROOM_CREATED,
  payload: data,
});

export const userJoined = (data: RoomData) => ({
  type: USER_JOINED,
  payload: data,
});

export const roomInformation = (data: RoomData) => ({
  type: ROOM_INFORMATION,
  payload: data,
});
