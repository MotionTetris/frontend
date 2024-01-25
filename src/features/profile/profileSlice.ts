// src/features/profile/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState } from '../../app/store';

const initialState: ProfileState = {
  photo: '',
  nickname: '',
};

export const profileSlice = createSlice({
  name: 'profile',
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
