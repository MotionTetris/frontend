// @types/room.ts

export interface RoomStatus {
    showStatusMessage: boolean;
    statusMessage: string;
  }
  
  export interface RoomStatusState {
    [roomId: string]: RoomStatus;
  }
  
  export type RoomCardComponentProps = {
    roomData: RoomData; // Props로 roomData를 받음
    onRoomClick: (roomData: RoomData) => void; // 클릭 이벤트 함수 추가
  };

  export const RoomStatuses = {
    READY: 'READY',
    START: 'START',
    WAIT: 'WAIT',
  } as const;

  export const LockStatuses = {
    LOCK: 'LOCK',
    UNLOCK: 'UNLOCK',
  } as const;

  export const CreatorStatuses = {
    WAIT: 'WAIT',
    READY: 'READY',
    START: 'START',
  } as const;
  
  export const PlayerStatuses = {
    WAIT: 'WAIT',
    READY: 'READY',
  } as const;
  
  export const Role = {
    CREATOR: 'CREATOR',
    PLAYER:'PLAYER'
  }

  export interface RoomData {
    role: keyof typeof Role;
    playerstatus: keyof typeof CreatorStatuses | keyof typeof PlayerStatuses;
    roomId: number;
    title: string;
    creatorProfilePic: string;
    creatorNickname: string;
    currentCount: number;
    score:number;
    maxCount: number;
    backgroundUrl: string;
    roomStatus: keyof typeof RoomStatuses;
    isLock: keyof typeof LockStatuses;
    players: string[];
}

export interface UserProfile {
  profilePicture: string;
  nickname: string;
  Role: keyof typeof Role;
  bannerBackground : string;
  playerstatus: keyof typeof CreatorStatuses | keyof typeof PlayerStatuses;
  score:number;
}

export interface RoomAPIResponse {
  userProfile: UserProfile;
  roomData: RoomData;
}

export type RoomModalProps = {
  roomData: RoomData;
  onClose: () => void;
  onRoomClick: (roomData: RoomData) => void;
};

export interface RoomState {
  roomStatus: RoomStatusState;
  roomCardComponentProps: RoomCardComponentProps;
  roomData: RoomData;
  roomModalProps: RoomModalProps;
}

export interface CreateRoomModalProps {
  onClose: () => void;
  onOpen: (roomData: RoomData) => void;
  createRoom: (roomData: RoomData) => void;
}