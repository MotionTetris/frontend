import { Server } from 'mock-socket';
import { Role } from '../types/room.ts';

// Mock WebSocket 서버
const mockServer = new Server('ws://localhost:8080');

mockServer.on('connection', socket => {
  setInterval(() => {
    const userProfile = {
      profilePicture: `/assets/Profile${Math.floor(Math.random() * 3) + 1}.png`,
      nickname: `User${Math.floor(Math.random() * 100) + 1}`,
      Role: Object.values(Role)[Math.floor(Math.random() * Object.values(Role).length)],
      bannerBackground: `/assets/RoomHeader${Math.floor(Math.random() * 3) + 1}.png`,
      playerstatus: 'WAIT',
      score: Math.floor(Math.random() * 100),
    };

    socket.send(JSON.stringify(userProfile));
  }, 3000);
});

export { mockServer };
