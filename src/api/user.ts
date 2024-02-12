import { getToken } from "@src/data-store/token";
import axios from "axios";

export const userProfileAPI = async (nickname: string) => {
  const response = await axios.get(`/api/user/${nickname}`, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });
  return response.data;
};

export const userChangePasswordAPI = async (nickname: string, old_password: string, new_password:string) => {
  const response = await axios.post("/api/user/change-password/", {
    nickname,
    old_password,
    new_password,
  });
  return response.data;
};

export const userByeAPI = async (nickname: string) => {
  const response = await axios.post("/api/user/bye/", {
    nickname,
  });
  return response.data;
};
