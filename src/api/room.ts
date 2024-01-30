import axios from 'axios';
import { RoomData, UserProfile } from '../types/room';

// 방 목록 가져오기
export const RoomsdataAPI = async (currentPage: number): Promise<RoomData[]> => {
  try {
    const response = await axios.get(`/api/rooms?page=${currentPage}`);
    return response.data.rooms;
  } catch (error) {
    throw error; // 오류를 던져서 상위 컴포넌트에서 처리할 수 있게 합니다.
  }
};

// 사용자 프로필과 방 데이터 가져오기
export const getUserProfileAndRoomData = async (): Promise<UserProfile> =>{
  try {
    const userProfileResponse = await axios.get(`/api/user/profile`);
    console.log ("userProfile",userProfileResponse.data)
    return userProfileResponse.data;
  } catch (error) {
    throw error; // 오류를 던져서 상위 컴포넌트에서 처리할 수 있게 합니다.
  }
};
