import axios from 'axios';

export const signupAPI = async (nickname: string, email: string, password: string) => {
  try {
    const response = await axios.post('/api/signup', { nickname, email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginAPI = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/login', { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};