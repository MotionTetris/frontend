// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from '../features/banner/bannerSlice';
import profileReducer from '../features/profile/profileSlice';
import rankingReducer from '../features/ranking/rankingSlice'; 
import roomStatusReducer from '../features/roomStatus/roomStatusSlice';
import gameReducer from '../features/game/gameSlice';

export const store = configureStore({
  reducer: {
    banner: bannerReducer,
    profile: profileReducer,
    ranking: rankingReducer,
    roomStatus: roomStatusReducer,
    game: gameReducer,
    // 기타 다른 feature reducers
  },
  devTools: process.env.NODE_ENV !== 'production', // 개발 환경에서만 DevTools 활성화
});

// ApiResponse 타입 정의
export interface ApiResponse {
  rankings: {
    profilePic: string;
    username: string;
    score: number;
  }[];
  totalPages: number;
}

export interface SidebarComponentProps {
  activePath: string;
}

export type RoomCardComponentProps = {
  roomData: RoomData; // Props로 roomData를 받음
  onRoomClick: (roomData: RoomData) => void; // 클릭 이벤트 함수 추가
};
// 각 feature의 상태 타입 정의 필요
export type GameState = {
  rooms: RoomData[];
  currentPage: number;
  isModalOpen: boolean;
  selectedRoom: RoomData | null;
}
// RoomData 타입 정의
export type RoomData = {
  title: string;
  status: string;
  creatorProfilePic: string;
  creatorNickname: string;
  currentCount: number;
  maxCount: number;
  backgroundUrl: string;
};

// RootState에 각 feature의 상태 타입 추가
export type RootState = ReturnType<typeof store.getState> & {
  game: GameState;
}

export type AppDispatch = typeof store.dispatch;
