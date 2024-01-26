import axios from 'axios';
import { ApiResponse } from '@app/store';

export const rankingAPI = async (currentPage: number): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`/api/rankings`, { page: currentPage });
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings:', error);
    throw error;
  }
};
