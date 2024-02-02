import axios from "axios";
import { CreateRoomCard, LobbyGameRoomCard } from "../types/Refactoring";

// 방 생성 API 호출 함수
export const createRoomAPI = async (roomData: CreateRoomCard):Promise<LobbyGameRoomCard> => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    "http://54.180.148.103:3000/room",
    roomData,
    config,
  );
  return response.data;
};


// 방 생성 API 호출 함수
export const requestRoomAPI = async ():Promise<LobbyGameRoomCard[]> => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(
    "http://54.180.148.103:3000/room",
    config,
  );
  console.log(response.data.message)
  return response.data.message;
};


