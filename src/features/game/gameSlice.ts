// src/features/game/gameSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface RoomData {
  title: string;
  status: string;
  creatorProfilePic: string;
  creatorNickname: string;
  currentCount: number;
  maxCount: number;
  backgroundUrl: string;
}

interface GameState {
  rooms: RoomData[];
  currentPage: number;
  isModalOpen: boolean;
  selectedRoom: RoomData | null;
}

const initialState: GameState = {
  rooms: [],
  currentPage: 1,
  isModalOpen: false,
  selectedRoom: null,
};

export const fetchRooms = createAsyncThunk(
  'game/fetchRooms',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ rooms: RoomData[] }>('/api/room-data', {
        params: {
          page: page
        }
      });
      return response.data.rooms;
    } catch (error) {
      return rejectWithValue('방 정보를 가져오는데 실패했습니다.');
    }
  }
);

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    openModal: (state, action: PayloadAction<RoomData>) => {
      state.selectedRoom = action.payload;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      state.rooms = action.payload;
    });
  },
});

export const { setCurrentPage, openModal, closeModal } = gameSlice.actions;

export default gameSlice.reducer;
