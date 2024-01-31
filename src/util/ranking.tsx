import { Dispatch } from 'redux';
import { setCurrentPage } from '../redux/ranking/rankingSlice';

export const goToPreviousPage = (currentPage: number, dispatch: Dispatch) => {
  dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));
};

export const goToNextPage = (currentPage: number, totalPages: number, dispatch: Dispatch) => {
  dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)));
};

const rankingsPerPage = 10;
export const renderRank = (currentPage: number, index: number) => {
  const rankNumber = (currentPage - 1) * rankingsPerPage + index + 1;
  if (rankNumber <= 3) {
    return (
      <img 
        src={`src/assets/Rank_${rankNumber}.png`} 
        alt={`Rank ${rankNumber}`} 
        style={{ width: '50px', height: '50px' }} 
      />
    );
  } else {
    return rankNumber;
  }
};
