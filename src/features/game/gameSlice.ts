// src/features/game/gameSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RoomData, Role, CreatorStatuses, PlayerStatuses  } from '../../types/room';
import { GameState } from '../../types/game';


const initialState: GameState = {
  player: {
    role: 'PLAYER',
    playerstatus: 'WAITING',
    roomid: '',
    title: '',
    creatorProfilePic: '',
    creatorNickname: '',
    currentCount: 0,
    maxCount: 0,
    backgroundUrl: '',
    roomStatus: 'WAIT',
    isLock: 'UNLOCK',
    players: [],
    score: 0, 
  },
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
    createPlayer: (state) => {
      state.player.role = 'CREATOR';
    },
    togglePlayerReady: (state) => {
      if (state.player.role === Role.CREATOR) {
        state.player.playerstatus = state.player.playerstatus === CreatorStatuses.WAITING ? CreatorStatuses.READY : CreatorStatuses.WAITING;
      } else if (state.player.role === Role.PLAYER) {
        state.player.playerstatus = state.player.playerstatus === PlayerStatuses.WAITING ? PlayerStatuses.READY : PlayerStatuses.WAITING;
      }
    },
    
    
    startGame: (state) => {
      state.player.roomStatus = 'START';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      state.rooms = action.payload;
    });
  },

});

export const { setCurrentPage, openModal, closeModal, createPlayer, togglePlayerReady, startGame } = gameSlice.actions;

export default gameSlice.reducer;
