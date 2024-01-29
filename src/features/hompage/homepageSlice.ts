import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomepageState } from '../../types/homepage';


// Define the initial state using that type
  const initialState: HomepageState = {
    email: '',
    isAuthenticated: false,
    error: null,
  };


export const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; isAuthenticated: boolean }>) => {
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setError: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
    },
    clearUser: (state) => {
      state.email = '';
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setUser, setError, clearUser } = homepageSlice.actions;

export default homepageSlice.reducer;
