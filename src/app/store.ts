import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../redux/profile/profileSlice";
import rankingReducer from "../redux/ranking/rankingSlice";
import roomStatusReducer from "../redux/roomStatus/roomStatusSlice";
import gameReducer from "../redux/game/gameSlice";
import homepageReducer from "../redux/hompage/homepageSlice";
import signupReducer from "../redux/hompage/signupSlice";
import socketReducer from "../redux/socket/socketReducer";
import { CommonState } from "../types/common";
import { GameState } from "../types/game";
import { HomepageState } from "../types/homepage";
import { ProfileState } from "../types/profile";
import { RankingState } from "../types/ranking";
import { RoomState } from "../types/room";
import { SignupState } from "../types/signup";
import { BannerState } from "../types/banner";
import { Socket } from "socket.io-client";
import { InGamePlayerCard } from "../types/Refactoring";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    ranking: rankingReducer,
    roomStatus: roomStatusReducer,
    game: gameReducer,
    homepage: homepageReducer,
    signup: signupReducer,
    socket: socketReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // 개발 환경에서만 DevTools 활성화
});

export type RootState = {
  common: CommonState;
  game: InGamePlayerCard;
  homepage: HomepageState;
  profile: ProfileState;
  ranking: RankingState;
  roomState: RoomState;
  signup: SignupState;
  banner: BannerState;
  socket: Socket | null;
};

export type AppDispatch = typeof store.dispatch;
