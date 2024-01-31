import axios from "axios";

export const userProfileAPI = async (nickname: string) => {
    try {
      const response = await axios.get(`/api/user/${nickname}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      });
      return response.data;
    } catch (error) {
      console.error('Client: Error fetching /api/profile', error);
      throw error;
    }
  };
  