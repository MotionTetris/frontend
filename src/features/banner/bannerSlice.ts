// src/features/banner/bannerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 상태에 대한 타입을 정의합니다.
interface BannerState {
  currentIndex: number;
}

const initialState: BannerState = {
  currentIndex: 0,
};

export const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    goToPrevious: (state, action: PayloadAction<number>) => {
      const isFirstSlide = state.currentIndex === 0;
      state.currentIndex = isFirstSlide ? action.payload - 1 : state.currentIndex - 1;
    },
    goToNext: (state, action: PayloadAction<number>) => {
      state.currentIndex = (state.currentIndex + 1) % action.payload;
    },
  },
});

export const { setCurrentIndex, goToPrevious, goToNext } = bannerSlice.actions;
export default bannerSlice.reducer;
