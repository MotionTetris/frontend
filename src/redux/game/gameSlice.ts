// src/features/game/gameSlice.ts
import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { InGamePlayerCard } from "../../types/Refactoring";


const initialState: InGamePlayerCard = {
  playersNickname: new Set<string>(), // Set<string>으로 초기화
  creatorNickname: '',
  roomId: 0, // 예시 값
  roomTitle: '', // 예시 값
  maxCount: 0, // 예시 값
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setOtherNickname: (state, action: PayloadAction<Set<string>>) => {
      state.playersNickname = action.payload;
    },
    setCreatorNickname: (state, action: PayloadAction<string>) => {
      state.creatorNickname = action.payload;
    },
  },
});

export const {
  setOtherNickname,
  setCreatorNickname,
} = gameSlice.actions;

export default gameSlice.reducer;