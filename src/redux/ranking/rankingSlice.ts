import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RankingState, RankingItem } from "@type/ranking";

const initialState: RankingState = {
  rankings: [],
  totalPages: 0,
  currentPage: 1,
};

export const rankingSlice = createSlice({
  name: "ranking",
  initialState,
  reducers: {
    setRankings: (state, action: PayloadAction<RankingItem[]>) => {
      state.rankings = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setRankings, setTotalPages, setCurrentPage } =
  rankingSlice.actions;

export default rankingSlice.reducer;
