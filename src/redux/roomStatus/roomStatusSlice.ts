import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoomStatusState } from '../../types/room';

const initialState: RoomStatusState = {};

export const roomStatusSlice = createSlice({
  name: 'roomStatus',
  initialState,
  reducers: {
    setShowStatusMessage: (state, action: PayloadAction<{ roomId: string; show: boolean }>) => {
      const { roomId, show } = action.payload;
      if (!state[roomId]) {
        state[roomId] = { showStatusMessage: show, statusMessage: '' };
      } else {
        state[roomId].showStatusMessage = show;
      }
    },
    setStatusMessage: (state, action: PayloadAction<{ roomId: string; message: string }>) => {
      const { roomId, message } = action.payload;
      if (!state[roomId]) {
        state[roomId] = { showStatusMessage: false, statusMessage: message };
      } else {
        state[roomId].statusMessage = message;
      }
    },
  },
});

export const { setShowStatusMessage, setStatusMessage } = roomStatusSlice.actions;

export default roomStatusSlice.reducer;
