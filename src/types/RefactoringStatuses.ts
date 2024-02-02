export const RoomStatuses = {
  READY: "READY",
  START: "START",
  WAIT: "WAIT",
} as const;

export const LockStatuses = {
  LOCK: "LOCK",
  UNLOCK: "UNLOCK",
} as const;

export const CreatorStatuses = {
  WAIT: "WAIT",
  READY: "READY",
  START: "START",
} as const;

export const PlayerStatuses = {
  WAIT: "WAIT",
  READY: "READY",
} as const;

export const Role = {
  CREATOR: "CREATOR",
  PLAYER: "PLAYER",
};
