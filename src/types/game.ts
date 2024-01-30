import { RoomData, UserProfile } from './room';

export type GameState = {
    rooms: RoomData[];
    currentPage: number;
    isModalOpen: boolean;
    selectedRoom: RoomData | null;
    player:UserProfile;
}
  