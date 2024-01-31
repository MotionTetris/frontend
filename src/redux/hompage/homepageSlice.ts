import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomepageState } from '../../types/homepage';

  const initialState: HomepageState = {
    nickname: '',
    email: '',
    isAuthenticated: false,
    error: null,
  };

export const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ nickname: string, email: string; isAuthenticated: boolean }>) => {
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setError: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
    },
    clearUser: (state) => {
      state.nickname = '';
      state.email = '';
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setUser, setError, clearUser } = homepageSlice.actions;

export default homepageSlice.reducer;
