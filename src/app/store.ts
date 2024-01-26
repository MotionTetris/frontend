// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from '../features/banner/bannerSlice';
import profileReducer from '../features/profile/profileSlice';
import rankingReducer from '../features/ranking/rankingSlice'; 
import roomStatusReducer from '../features/roomStatus/roomStatusSlice';
import gameReducer from '../features/game/gameSlice';
import homepageReducer from '../features/hompage/homepageSlice';
import signupReducer from '../features/hompage/signupSlice'

export const store = configureStore({
  reducer: {
    banner: bannerReducer,
    profile: profileReducer,
    ranking: rankingReducer,
    roomStatus: roomStatusReducer,
    game: gameReducer,
    homepage: homepageReducer,
    signup: signupReducer,
    // 기타 다른 feature reducers
  },
  devTools: process.env.NODE_ENV !== 'production', // 개발 환경에서만 DevTools 활성화
});



export interface StyledLinkProps {
  active: boolean;
  image: string; // 이미지 URL을 위한 속성 추가
}


export interface SignupState {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  nicknameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
}

export interface RoomStatus {
  showStatusMessage: boolean;
  statusMessage: string;
}

export interface RoomStatusState {
  [roomId: string]: RoomStatus;
}


export interface RankingState {
  rankings: RankingItem[];
  totalPages: number;
  currentPage: number;
}

// RankingItem 인터페이스 정의
export interface RankingItem {
  profilePic: string;
  username: string;
  score: number;
}

export interface HomepageState {
  email: string;
  isAuthenticated: boolean;
  error: null | string; // error can be a string or null
}

export interface ProfileState {
  photo: string;
  nickname: string;
}

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
  id: string;
  title: string;
  status: string;
  creatorProfilePic: string;
  creatorNickname: string;
  currentCount: number;
  maxCount: number;
  backgroundUrl: string;
};

export type RoomModalProps = {
  roomData: RoomData;
  onClose: () => void;
  onRoomClick: (roomData: RoomData) => void;
};

// RootState에 각 feature의 상태 타입 추가
export type RootState = ReturnType<typeof store.getState>; // game: GameState; 제거

export type AppDispatch = typeof store.dispatch;