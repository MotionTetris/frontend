import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileState } from "@type/profile";

const initialState: ProfileState = {
  nickname: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      state.nickname = action.payload.nickname;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
