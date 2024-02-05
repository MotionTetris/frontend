// RankingComponent.tsx
import { useEffect, useState } from "react";
import { rankingAPI } from "../../api/ranking";
import {
  RankContainer,
  RankBar,
  Rank,
  RankUsername,
  RankScore,
  RankLabel,
  RankLabelsContainer,
  RankPaginationContainer,
  RankSection,
  RankButton,
} from "./styles";
import { Ranking } from "../../types/Refactoring";

const Ranking: React.FC = () => {
  const rankingsPerPage = 10;
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const goToPreviousPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const renderRank = (index: number) => {
    const rankNumber = (currentPage - 1) * rankingsPerPage + index + 1;
    if (rankNumber <= 3) {
      return (
        <img
          src={`src/assets/Rank_${rankNumber}.png`}
          alt={`Rank ${rankNumber}`}
          style={{ width: "50px", height: "50px" }}
        />
      );
    } else {
      return rankNumber;
    }
  };

  useEffect(() => {
    const fetchAndSetRankings = async () => {
      try {
        const data = await rankingAPI();
        setRankings(data.rankings.sort((a, b) => b.score - a.score)); // 점수에 따라 랭킹 정렬
        setTotalPages(data.totalPages);
      } catch (error) {
        // 오류 처리
      }
    };
    fetchAndSetRankings();
  }, [currentPage]);

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
            <Rank>{renderRank(index)}</Rank>
            <RankUsername>{ranking.nickname}</RankUsername>
            <RankScore>{ranking.score}</RankScore>
          </RankBar>
        ))}
      </RankContainer>
      <RankPaginationContainer>
        <RankButton
          direction="left"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        />
        <RankButton
          direction="right"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        />
      </RankPaginationContainer>
    </RankSection>
  );
};

export default Ranking;
