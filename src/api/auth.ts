import axios from 'axios';

export const signupAPI = async (nickname: string, email: string, password: string) => {
  try {
    const response = await axios.post('/api/user/', { nickname, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginAPI = async (nickname: string, password: string) => {
  try {
    const response = await axios.post('/api/user/signin/', { nickname, password });
    console.log("data", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

