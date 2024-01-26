import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '@app/store';
import { Socketconnect } from '@util/socket';

const GameRoom = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const roomData = useSelector((state: RootState) => state.game.rooms.find(room => room.id === roomId));
  
    useEffect(() => {
      const { cleanup } = Socketconnect(roomId!);
  
      return () => {
        cleanup();
      };
    }, [roomId]); 

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
