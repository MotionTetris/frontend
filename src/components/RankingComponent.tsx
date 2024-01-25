// RankingComponent.tsx
import { useEffect, useState } from 'react';
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
  PageNumber,
  RankingSection
} from '../Styled'; // Styled.tsx 파일에서 필요한 스타일 컴포넌트를 가져옵니다.

// RankingItem 인터페이스 정의
interface RankingItem {
  profilePic: string;
  username: string;
  score: number;
}

interface ApiResponse {
  rankings: RankingItem[];
  totalPages: number;
}

const rankingsPerPage = 10;

const RankingComponent: React.FC = () => {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0); // 초기값은 0으로 설정

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
        // POST 요청을 보내 현재 페이지의 랭킹 데이터를 받아옵니다.
        const response = await axios.post<ApiResponse>(`/api/rankings`, { page: currentPage });
        // 응답 데이터를 상태에 저장합니다.
        setRankings(response.data.rankings);
        setTotalPages(response.data.totalPages); // 서버로부터 받은 총 페이지 수로 업데이트
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };

    fetchRankings();
  }, [currentPage]);


  // 페이지 번호 클릭 핸들러
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 번호를 렌더링하기 위한 컴포넌트
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <PageNumber
          key={i}
          onClick={() => handlePageClick(i)}
          active={currentPage === i}
        >
          {i}
        </PageNumber>
      );
    }
    return pageNumbers;
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
            <Rank>{renderRank(index)}</Rank> {/* 여기에서 renderRank 함수를 호출합니다. */}
            <ProfileImage src={ranking.profilePic} alt={`${ranking.username}'s profile`} />
            <Username>{ranking.username}</Username>
            <Score>{ranking.score}</Score>
          </RankingBar>
        ))}
      </RankingContainer>
      <PaginationContainer>
        {renderPageNumbers()}
      </PaginationContainer>
      </RankingSection>
    </>
  );
};

export default RankingComponent;
