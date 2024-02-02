import { RoomStatuses, LockStatuses } from "./RefactoringStatuses";

// User Type
export interface User {
  nickname: string;
  score: number;
}
// Ranking Type (API)
export interface Ranking {
  nickname: string;
  score: number;
}
// 수정된 랭킹 타입 (API 응답)
export interface APIRankingResponse {
  rankings: Ranking[];
  totalPages: number;
}

// 밖에서 보는 방 표시용 type
export interface LobbyGameRoomCard {
  roomId: number;
  roomTitle: string;
  creatorNickname: string;
  currentCount: number;
  maxCount: number;
  backgroundUrl: string;
  roomStatus: keyof typeof RoomStatuses; // Players들이 READY를 다 누르면 READY / 아니면 WAIT / 시작했으면 START
  isLock: keyof typeof LockStatuses;
}

export interface CreateRoomCard {
  roomTitle: string;
  creatorNickname: string;
  currentCount: number;
  maxCount: number;
  backgroundUrl: string;
  roomStatus: keyof typeof RoomStatuses; // Players들이 READY를 다 누르면 READY / 아니면 WAIT / 시작했으면 START
  isLock: keyof typeof LockStatuses;
  password: string;
}

// 방 카드 그리는 type
export interface InGamePlayerCard {
  creatorNickname: string; // 얘가 소켓에서 받아온 정보가 일치하면 start 버튼 보임 , 누르면 socket에 start 눌렀다고 보내야함
  playersNickname: Set<string>; // 얘가 소켓에서 받아온 정보에 있으면 Ready 버튼 보임, 누르면 socket에 ready 눌렀다고 보내야함
  roomId: number;
  roomTitle: string;
}

// 게임 시작했을 떄 정보 type  (안씀  나중에)
export interface InGameInfo {}
