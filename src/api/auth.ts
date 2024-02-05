import axios from "axios";

export const signupAPI = async (
  nickname: string,
  email: string,
  password: string,
) => {
  const response = await axios.post("/api/user/", {
    nickname,
    email,
    password,
  });
  return response.data;
};

export const loginAPI = async (nickname: string, password: string) => {
  const response = await axios.post("/api/user/signin/", {
    nickname,
    password,
  });
  return response.data;
};
