import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setSocketStatus, socketConnected, socketDisconnected, roomCreated, userJoined, roomInformation } from '../../redux/socket/socketActions';
import { RoomData } from '../../types/room';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InRlc3RtYW4iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.0_Wib_oJ8TQ13mEbR3v0OK6sPQVQVLNy3i6btIemVMo';

export const useSocketIO = (url: string) => {
  const dispatch = useDispatch();
  const [localSocket, setLocalSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax : 5000,
    });

    setLocalSocket(socketIo);
    dispatch(setSocketStatus(true));

    socketIo.on('connect', () => {
      dispatch(socketConnected());
    });

    socketIo.on('disconnect', () => {
      dispatch(socketDisconnected());
    });

    socketIo.on('createRoom', (data: RoomData) => {
      dispatch(roomCreated(data));
    });

    socketIo.on('joinUser', (data: RoomData) => {
      dispatch(userJoined(data));
    });

    socketIo.on('roomInfo', (data: RoomData) => {
      dispatch(roomInformation(data));
    });

    return () => {
      socketIo.disconnect();
      dispatch(setSocketStatus(false));
    };
  }, [url, dispatch]);

  const joinUser = (roomId: number) => {
    if (localSocket) {
      localSocket.emit('joinRoom', { roomId });
    }
  };

  const createRoom = (roomId: number) => {
    if (localSocket) {
      localSocket.emit('createRoom', { roomId });
    }
  };

  return {
       joinUser,
       createRoom,
  };
};
