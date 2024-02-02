import axios from "axios";
import { APIRankingResponse } from "../types/Refactoring";

export const rankingAPI = async (): Promise<APIRankingResponse> => {
  const response = await axios.post<APIRankingResponse>(`/api/rankings`, {});
  return response.data;
};
