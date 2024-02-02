// src/features/game/gameSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  RoomData,
  Role,
  CreatorStatuses,
  PlayerStatuses,
} from "../../types/room";
import { GameState } from "../../types/game";

const initialState: GameState = {
  player: {
    Role: "PLAYER",
    playerstatus: "WAIT",
    profilePicture: "",
    nickname: "",
    bannerBackground: "",
    score: 0,
  },
  rooms: [],
  currentPage: 1,
  isModalOpen: false,
  selectedRoom: null,
};
export const fetchRooms = createAsyncThunk(
  "game/fetchRooms",
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ rooms: RoomData[] }>(
        "/api/room-data",
        {
          params: {
            page: page,
          },
        },
      );
      return response.data.rooms;
    } catch (error) {
      return rejectWithValue("방 정보를 가져오는데 실패했습니다.");
    }
  },
);

export const gameSlice = createSlice({
  name: "game",
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
      state.player.Role = "CREATOR";
    },
    togglePlayerReady: (state) => {
      if (state.player.Role === Role.CREATOR) {
        state.player.playerstatus =
          state.player.playerstatus === CreatorStatuses.WAIT
            ? CreatorStatuses.READY
            : CreatorStatuses.WAIT;
      } else if (state.player.Role === Role.PLAYER) {
        state.player.playerstatus =
          state.player.playerstatus === PlayerStatuses.WAIT
            ? PlayerStatuses.READY
            : PlayerStatuses.WAIT;
      }
    },

    startGame: (state) => {
      // 예시: selectedRoom이 설정되어 있고, 해당 방이 rooms 배열에 존재하는 경우
      const selectedRoom = state.selectedRoom;
      if (selectedRoom) {
        const room = state.rooms.find(
          (room) => room.roomid === selectedRoom.roomid,
        );
        if (room) {
          room.roomStatus = "START";
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      state.rooms = action.payload;
    });
  },
});

export const {
  setCurrentPage,
  openModal,
  closeModal,
  createPlayer,
  togglePlayerReady,
  startGame,
} = gameSlice.actions;

export default gameSlice.reducer;
