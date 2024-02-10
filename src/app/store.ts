import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "@redux/profile/profileSlice";
import rankingReducer from "@redux/ranking/rankingSlice";
import roomStatusReducer from "@redux/roomStatus/roomStatusSlice";
import gameReducer from "@redux/game/gameSlice";
import homepageReducer from "@redux/hompage/homepageSlice";
import { CommonState } from "@type/common";
import { HomepageState } from "@type/homepage";
import { ProfileState } from "@type/profile";
import { RankingState } from "@type/ranking";
import { RoomState } from "@type/room";
import { BannerState } from "@type/banner";
import { InGamePlayerCard } from "@type/Refactoring";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    ranking: rankingReducer,
    roomStatus: roomStatusReducer,
    game: gameReducer,
    homepage: homepageReducer,
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
  banner: BannerState;
};

export type AppDispatch = typeof store.dispatch;
