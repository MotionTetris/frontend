import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3001';

export const Socketconnect = (roomId: string) => {
  const socket = io(SOCKET_SERVER_URL);
  socket.emit('joinRoom', { roomId });

  socket.on('message', message => {
    console.log(message);
  });

  const cleanup = () => {
    socket.emit('leaveRoom', { roomId });
    socket.disconnect();
  };

  return { socket, cleanup };
};
