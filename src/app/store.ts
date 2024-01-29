// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from '../features/banner/bannerSlice';
import profileReducer from '../features/profile/profileSlice';
import rankingReducer from '../features/ranking/rankingSlice'; 
import roomStatusReducer from '../features/roomStatus/roomStatusSlice';
import gameReducer from '../features/game/gameSlice';
import homepageReducer from '../features/hompage/homepageSlice';
import signupReducer from '../features/hompage/signupSlice';
import { CommonState } from '../types/common';
import { GameState } from '../types/game';
import { HomepageState } from '../types/homepage';
import { ProfileState } from '../types/profile';
import { RankingState } from '../types/ranking';
import { RoomState } from '../types/room';
import { SignupState } from '../types/signup';
import { BannerState } from '../types/banner';


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

export type RootState = {
  common: CommonState;
  game: GameState;
  homepage: HomepageState;
  profile: ProfileState;
  ranking: RankingState;
  roomState: RoomState;
  signup: SignupState;
  banner: BannerState;
};

export type AppDispatch = typeof store.dispatch;
