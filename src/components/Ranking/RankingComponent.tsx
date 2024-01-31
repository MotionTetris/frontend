// RankingComponent.tsx
// RankingComponent.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@app/store';
import { setRankings, setTotalPages } from '../../redux/ranking/rankingSlice';
import { rankingAPI } from '@api/ranking';
import { goToPreviousPage, goToNextPage, renderRank } from '@util/ranking';
import {
  RankContainer,
  RankBar,
  Rank,
  RankProfileImage,
  RankUsername,
  RankScore,
  RankLabel,
  RankLabelsContainer,
  RankPaginationContainer,
  RankSection,
  RankButton
} from './styles';

const RankingComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { rankings, totalPages, currentPage } = useSelector((state: RootState) => state.ranking);

  useEffect(() => {
    const fetchAndSetRankings = async () => {
      try {
        const data = await rankingAPI(currentPage);
        dispatch(setRankings(data.rankings));
        dispatch(setTotalPages(data.totalPages));
      } catch (error) {
        // 오류 처리
      }
    };
    fetchAndSetRankings();
  }, [dispatch, currentPage]);

  return (
      <RankSection>
        <RankLabelsContainer>
          <RankLabel data-label="rank">순위</RankLabel>
          <RankLabel data-label="username">별명</RankLabel>
          <RankLabel data-label="score">점수</RankLabel>
        </RankLabelsContainer>
        <RankContainer>
          {rankings.map((ranking, index) => (
            <RankBar key={index}>
              <Rank>{renderRank(currentPage, index)}</Rank>
              <RankProfileImage src={ranking.profilePic} alt={`${ranking.username}'s profile`} />
              <RankUsername>{ranking.username}</RankUsername>
              <RankScore>{ranking.score}</RankScore>
            </RankBar>
          ))}
        </RankContainer>
        <RankPaginationContainer>
          <RankButton direction="left" onClick={() => goToPreviousPage(currentPage, dispatch)} disabled={currentPage === 1} />
          <RankButton direction="right" onClick={() => goToNextPage(currentPage, totalPages, dispatch)} disabled={currentPage === totalPages} />
        </RankPaginationContainer>
      </RankSection>
  );
};

export default RankingComponent;