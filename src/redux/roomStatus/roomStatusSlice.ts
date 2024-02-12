import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomData, RoomStatus } from "@type/room";

interface RoomStatusState extends RoomStatus {
  rooms: Record<string, RoomData>;
}

const initialState: RoomStatusState = {
  showStatusMessage: false,
  statusMessage: "",
  rooms: {},
};

export const roomStatusSlice = createSlice({
  name: "roomStatus",
  initialState,
  reducers: {
    drawUserInterface: (state, action: PayloadAction<RoomData>) => {
      const roomData = action.payload;
      state.rooms[roomData.roomId] = roomData;
    },
    setShowStatusMessage: (
      state,
      action: PayloadAction<{ roomId: number; show: boolean }>,
    ) => {
      const { roomId, show } = action.payload;
      if (state.rooms[roomId]) {
        state.showStatusMessage = show;
      }
    },
    setStatusMessage: (
      state,
      action: PayloadAction<{ roomId: number; message: string }>,
    ) => {
      const { roomId, message } = action.payload;
      if (state.rooms[roomId]) {
        state.statusMessage = message;
      }
    },
  },
});

export const { drawUserInterface, setShowStatusMessage, setStatusMessage } =
  roomStatusSlice.actions;

export default roomStatusSlice.reducer;
