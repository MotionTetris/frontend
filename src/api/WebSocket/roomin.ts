// 클라이언트 코드
import { useEffect } from 'react';
import io from 'socket.io-client';

export const RoominSocketIO = (url: string, onMessage: (data: any) => void) => {
  useEffect(() => {
    const socket = io(url);

    socket.on('message', onMessage);

    // 컴포넌트가 unmount될 때 Socket.IO 연결 종료
    return () => {
      socket.disconnect();
    };
  }, [url, onMessage]);
};
