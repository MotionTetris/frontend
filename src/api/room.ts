import axios from 'axios';
import { RoomData } from '@app/store';

// 방 목록 가져오기
export const RoomsdataAPI = async (currentPage: number): Promise<RoomData[]> => {
  try {
    const response = await axios.get(`/api/rooms?page=${currentPage}`);
    return response.data.rooms;
  } catch (error) {
    throw error; // 오류를 던져서 상위 컴포넌트에서 처리할 수 있게 합니다.
  }
};
