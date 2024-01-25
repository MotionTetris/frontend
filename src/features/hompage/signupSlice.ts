import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignupState } from '../../app/store';


const initialState: SignupState = {
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  nicknameError: '',
  emailError: '',
  passwordError: '',
  confirmPasswordError: '',
};

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setNicknameError: (state, action: PayloadAction<string>) => {
      state.nicknameError = action.payload;
    },
    setEmailError: (state, action: PayloadAction<string>) => {
      state.emailError = action.payload;
    },
    setPasswordError: (state, action: PayloadAction<string>) => {
      state.passwordError = action.payload;
    },
    setConfirmPasswordError: (state, action: PayloadAction<string>) => {
      state.confirmPasswordError = action.payload;
    },
  },
});

export const {
  setNickname,
  setEmail,
  setPassword,
  setConfirmPassword,
  setNicknameError,
  setEmailError,
  setPasswordError,
  setConfirmPasswordError,
} = signupSlice.actions;

export default signupSlice.reducer;
