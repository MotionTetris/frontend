// RankingComponent.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState,ApiResponse } from '../app/store';
import { setRankings, setTotalPages, setCurrentPage } from '../features/ranking/rankingSlice';
import axios from 'axios';
import {
  RankingContainer,
  RankingBar,
  Rank,
  ProfileImage,
  Username,
  Score,
  Label,
  LabelsContainer,
  PaginationContainer,
  RankingSection,
  RankButton
} from '../Styled'; // Styled.tsx 파일에서 필요한 스타일 컴포넌트를 가져옵니다.


const rankingsPerPage = 10;

const RankingComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { rankings, totalPages, currentPage } = useSelector((state: RootState) => state.ranking);


 // 순위를 렌더링하는 함수
 const renderRank = (index: number) => {
  const rankNumber = (currentPage - 1) * rankingsPerPage + index + 1;
  if (rankNumber <= 3) {
    // 1위부터 3위까지는 이미지를 보여줍니다.
    return (
      <img 
        src={`src/assets/Rank_${rankNumber}.png`} 
        alt={`Rank ${rankNumber}`} 
        style={{ width: '50px', height: '50px' }} 
      />
    );
  } else {
    // 그 외의 경우는 숫자로 보여줍니다.
    return rankNumber;
  }
};


  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.post<ApiResponse>(`/api/rankings`, { page: currentPage });
        dispatch(setRankings(response.data.rankings));
        dispatch(setTotalPages(response.data.totalPages));
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };

    fetchRankings();
  }, [dispatch, currentPage]);



  const goToPreviousPage = () => {
    dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));
  };

  // 다음 페이지로 이동하는 함수
  const goToNextPage = () => {
    dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)));
  };


  return (
    <>
      <RankingSection>
        <LabelsContainer>
          <Label data-label="rank">순위</Label>
          <Label data-label="username">별명</Label>
          <Label data-label="score">점수</Label>
        </LabelsContainer>
        <RankingContainer>
          {rankings.map((ranking, index) => (
            <RankingBar key={index}>
              <Rank>{renderRank(index)}</Rank>
              <ProfileImage src={ranking.profilePic} alt={`${ranking.username}'s profile`} />
              <Username>{ranking.username}</Username>
              <Score>{ranking.score}</Score>
            </RankingBar>
          ))}
        </RankingContainer>
        <PaginationContainer>
          <RankButton direction="left" onClick={goToPreviousPage} disabled={currentPage === 1} />
          <RankButton direction="right" onClick={goToNextPage} disabled={currentPage === totalPages} />
        </PaginationContainer>
      </RankingSection>
    </>
  );
};

export default RankingComponent;