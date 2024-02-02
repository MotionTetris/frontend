// src/features/profile/profileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileState } from "../../types/profile";

const initialState: ProfileState = {
  active: false, // 기본값 설정
  activePath: "", // 기본값 설정
  photo: "",
  nickname: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      state.photo = action.payload.photo;
      state.nickname = action.payload.nickname;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
