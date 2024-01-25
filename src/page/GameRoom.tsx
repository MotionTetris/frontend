import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../app/store';
import io from 'socket.io-client';

const GameRoom = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const roomData = useSelector((state: RootState) => state.game.rooms.find(room => room.id === roomId));
  
    useEffect(() => {
      // 서버 주소로 Socket.IO 클라이언트 연결
      const socket = io('http://localhost:3001'); // 서버 주소를 적절히 설정하세요
  
      // 방에 입장하기
      socket.emit('joinRoom', { roomId });
  
      // 서버로부터 메시지 수신
      socket.on('message', message => {
        console.log(message);
        // 메시지 처리 로직을 여기에 작성하세요
      });
  
      // 컴포넌트가 언마운트될 때 소켓 연결 해제
      return () => {
        socket.emit('leaveRoom', { roomId });
        socket.disconnect();
      };
    }, [roomId]); // roomId가 변경될 때마다 useEffect 실행
  
    // roomData가 null 또는 undefined인 경우를 처리
    if (!roomData) {
      return <div>방을 찾을 수 없습니다.</div>;
    }
  

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px' }}>
      <h1>{roomData.title}</h1>
      <div>
        <img src={roomData.creatorProfilePic} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        <span>{roomData.creatorNickname}</span>
      </div>
      <div>상태: {roomData.status}</div>
      <div>참여 인원: {roomData.currentCount}/{roomData.maxCount}</div>
      <div style={{ marginTop: '10px' }}>
        <img src={roomData.backgroundUrl} alt="방 배경" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '5px' }} />
      </div>
    </div>
  );
};

export default GameRoom;
