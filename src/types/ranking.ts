export interface RankingState {
    rankings: RankingItem[];
    totalPages: number;
    currentPage: number;
}
  
export interface RankingItem {
  profilePic: string;
  username: string;
  score: number;
}
  