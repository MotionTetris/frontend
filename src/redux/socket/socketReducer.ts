import { SET_SOCKET_STATUS, SOCKET_CONNECTED, SOCKET_DISCONNECTED, ROOM_CREATED, USER_JOINED, ROOM_INFORMATION } from "./socketActions";

const initialState = {
  isConnected: false,
  roomData: null,  // Add more fields as needed
};

const socketReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_SOCKET_STATUS:
      return { ...state, isConnected: action.payload };
    case SOCKET_CONNECTED:
      return { ...state, isConnected: true };
    case SOCKET_DISCONNECTED:
      return { ...state, isConnected: false };
    case ROOM_CREATED:
      return { ...state, roomData: action.payload };
    case USER_JOINED:
      return { ...state, roomData: action.payload };  // Handle as needed
    case ROOM_INFORMATION:
      return { ...state, roomData: action.payload };  // Handle as needed
    default:
      return state;
  }
};

export default socketReducer;
