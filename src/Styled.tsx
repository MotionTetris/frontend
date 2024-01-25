// Styled.tsx
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';


interface StyledLinkProps {
  active: boolean;
  image: string; // 이미지 URL을 위한 속성 추가
}

// SidebarComponent

export const Sidebar = styled.aside`
  width: 280px;
  background-color: #071040;
  display: flex;
  flex-direction: column; // 세로 방향으로 정렬
  align-items: center;
  height: 100vh; // 전체 뷰포트의 높이를 차지
  position: fixed; // 사이드바를 브라우저에 고정
  left: 0;
  top: 0;
  padding-top: 250px; // 버튼들을 아래로 이동시키기 위한 상단 패딩 추가
`;

export const StyledLinkContainer = styled.div`
  display: flex;
  gap: 50px; // 버튼 간의 간격을 조절할 수 있는 gap 속성 사용
`;
export const StyledLink = styled(Link)<StyledLinkProps>`
  width: 200px;
  height: 55px;
  left: 30vw;
  margin: 60px 0;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-start; // 글자와 이미지를 시작 지점에 정렬
  background: linear-gradient(90deg, rgba(54,209,220,1) 0%, rgba(91,134,229,1) 100%);
  border-radius: 60px;
  transition: box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease, filter 0.3s ease; // 배경, 색상, 필터에 대한 transition 추가
  position: relative; // 이미지 위치를 조정하기 위해 relative 설정

  // 비활성 상태일 때의 배경 스타일
  background: ${props => props.active ? 'linear-gradient(90deg, rgba(54,209,220,1) 0%, rgba(91,134,229,1) 100%)' : 'grey'};
  filter: ${props => !props.active && 'grayscale(100%)'};
  &:hover {
    box-shadow: 0 0 5px white;
    background: linear-gradient(90deg, rgba(54,209,220,1) 0%, rgba(91,134,229,1) 100%); // 호버 상태에서 원래 배경으로 재설정
    color: white; // 호버 상태에서 원래 텍스트 색상으로 재설정
    filter: none; // 호버 상태에서 필터 해제

    &::before {
      filter: none; // 호버 상태에서 이미지 필터 해제
    }
  }

  // 이미지 컨테이너
  &::before {
    content: '';
    display: block;
    position: relative;
    left: 20px;
    width: 35px; // 이미지의 너비
    height: 35px; // 이미지의 높이
    background-image: url('${props => props.image}');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 35px;
    filter: ${props => !props.active && 'grayscale(100%)'}; // 비활성 상태일 때 회색 필터 적용
    
  }
`;


// Headercomponent

export const Header = styled.header`
  height: 100px;
  background: url('/src/assets/HeaderBackground.png') no-repeat center center; // 배경 이미지 설정
  background-size: cover; // 배경 이미지를 컨테이너에 맞게 조절
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed; // 고정 위치 설정
  top: 0; // 상단에 고정
  left: 0; // 좌측에 고정
  width: 100%; // 화면 전체 너비를 차지하도록 설정
  z-index:3;
`;


export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-48%);
`;

export const Logo = styled.img`
width: 50px;
height: 50px;
border-radius: 50%;
border: 3px solid white;
transition: box-shadow 0.3s ease;
margin-right: 10px;

&:hover {
  box-shadow: 0 0 10px white;
}
`;

export const LogoTitle = styled.p`
  color: white;
  display: inline-block;
  vertical-align: middle;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 4vw;
  top: 50%;
  transform: translateY(-50%);
`;

export const ProfilePhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  border: 3px solid white;
  transition: box-shadow 0.3s ease;
  margin-right: 10px;

  &:hover {
    box-shadow: 0 0 10px white;
  }
`;

export const ProfileNickName = styled.p`
  color: white;
  display: inline-block;
  vertical-align: middle;
`;

// BannerComponent

export const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; // 배너 내용을 가운데 정렬
  width: 70vw; // 가로 길이를 뷰포트 너비의 70%로 설정
  height: 60vh; // 세로 길이를 뷰포트 너비의 20%로 설정
  left:15vw;
  margin-top: calc((100vh - 100px - 280px - 20vh) / 2); // 상단 마진을 계산
  margin-bottom: calc((100vh - 100px - 280px - 20vh) / 2); // 하단 마진을 계산
  position: relative;
  border-radius: 2vw; // 둥근 모서리
  box-shadow: 0 2vw 4vw rgba(0, 0, 0, 0.1); // 그림자
  overflow: hidden; // 이미지가 컨테이너 밖으로 나가지 않도록
  background: white;
  transition: all 0.5s ease; // 모든 속성에 대해 0.5초 동안 부드러운 전환 효과 적용
`;



export const Slide = styled.div`
  width: 100%;
  height: 100%;
  display: flex; // 슬라이드를 가로로 나열
  transition: transform 0.5s ease-in-out; // transform 속성에 대해 부드러운 전환 효과 적용
`;

export const ImageWrapper = styled.div`
  width: 100%; // 각 이미지 래퍼의 너비는 컨테이너의 너비와 동일
  flex-shrink: 0; // 래퍼의 크기가 줄어들지 않도록 설정
  position: relative;
`;


export const Image = styled.img`
position: absolute;
top: 0px;
left: 00px;
  width: 100%;
  height: 100%; // 컨테이너에 맞춰 이미지 크기 조정
  object-fit: cover; // 이미지 비율 유지하면서 컨테이너를 채움
  transition: transform 0.5s ease-in-out;
`;

export const ArrowButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  width: 50px; // 화살표 이미지 크기 조정
  height: 50px; // 화살표 이미지 크기 조정
  cursor: pointer;
  z-index: 1;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  ${({ direction }) => direction === 'left' && `
    left: 10px;
    background-image: url('src/assets/ArrowLeft.png'); // 왼쪽 화살표 이미지
  `}

  ${({ direction }) => direction === 'right' && `
    right: 10px;
    background-image: url('src/assets/ArrowRight.png'); // 오른쪽 화살표 이미지
  `}
`;
export const SlideNumber = styled.div`
  position: absolute;
  bottom: 20px;
  right: 40px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5); // 반투명한 검정 배경
  padding: 5px 10px;
  border-radius: 10px; // 둥근 모서리
  font-size: 16px;
`;

// RankingComponent

export const RankButton = styled.button<{ direction: 'left' | 'right' }>`
  position: fixed; // 페이지 이동에도 위치 고정
  top: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-size: contain;
  border: none;
  outline: none;
  background-color: transparent;
  transition: transform 0.3s ease-in-out;
  ${({ direction }) => direction === 'left' && `
    left: 1vw;
    background-image: url('src/assets/ArrowLeft.png'); // 왼쪽 화살표 이미지
  `}

  ${({ direction }) => direction === 'right' && `
    right:1vw ;
    background-image: url('src/assets/ArrowRight.png'); // 오른쪽 화살표 이미지
  `}
  
  &:hover {
    transform: scale(1.2); // hover 시 이미지 확대
  }
`;

export const RankingSection = styled.div`
  display: flex;
  position:relative;
  left:25vw;
  bottom:5vh;
  flex-direction: column; // 내부 아이템을 세로로 정렬
  align-items: center; // 내부 아이템을 가운데 정렬
  justify-content: center; // 내부 내용을 가운데 정렬
  width: 50vw; // 넓이 조정
  height: 110vh;
  background: rgba( 255, 255, 255, 0.4 );
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 7px );
-webkit-backdrop-filter: blur( 7px );
  border-radius: 50px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
`

export const RankingContainer = styled.div`
  display: flex;
  flex-direction: column; // 내부 아이템을 세로로 정렬
  align-items: center;
  justify-content: center; // 내부 내용을 가운데 정렬
  width: 50vw; // 가로 길이를 뷰포트 너비의 70%로 설정
  top:0vh;
  left:0.5vw;
  position: relative;
  overflow-x: hidden; // 랭킹이 많아지면 스크롤
  background-color: transparent; // 배경색
  padding: 20px; // 내부 패딩
`;


export const RankingBar = styled.div`
  display: flex;
  align-items: center;
  position:relative;
  width: 100%; // 컨테이너 너비에 맞춤
  
  background-color: #f9f9f9; // 배경색
  border-radius: 10px; // 모서리 둥글게
  margin-bottom: 10px; // 바 사이의 여백
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // 그림자 효과
  transition: box-shadow 0.3s ease, transform 0.3s ease; // 부드러운 전환 효과
  scale:0.8;
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); // hover 시 그림자 효과
    transform: translateY(-3px); // hover 시 약간 위로 올라가는 효과
  }

  &:last-child {
    border-bottom: none; // 마지막 요소에는 하단 선 없음
    margin-bottom: 0; // 마지막 요소에는 하단 여백 없음
  }
`;


export const Rank = styled.span`
  font-size: 20px;
  margin-right: 60px; // 우측 여백
  width: 50px; // 고정 너비
  text-align: center; // 텍스트 가운데 정렬
`;

export const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%; // 원형 이미지
  margin-right: 30px; // 우측 여백
`;

export const Username = styled.span`
  flex-grow: 1;
  margin-right: 10px; // 우측 여백
`;

export const Score = styled.span`
  font-weight: bold;
  position: absolute;
  width: 100px; // 고정 너비
  right:100px;
`;

export const LabelsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 60vw; // 랭킹 컨테이너와 동일한 너비
  margin: auto; // 자동 마진으로 중앙 정렬
  left:5vw;
  bottom:2vh;
`;

export const Label = styled.p`
  font-size: 18px;
  color: #666; // 라벨 색상
  font-weight: bold; // 글자 굵게
  margin: 0 12px; // 기본 마진 설정, 필요에 따라 조정
  &[data-label="rank"] { // 순위 라벨에 대한 스타일
    margin-right: 6vw; // 오른쪽 여백 추가
  }

  &[data-label="username"] { // 별명 라벨에 대한 스타일
    margin-right: 19vw; // 오른쪽 여백 추가
  }
game
`;

export const PaginationContainer = styled.div`
position: relative;
display: flex;
board
width: 60vw; // 랭킹 컨테이너와 동일한 너비
margin: auto; // 자동 마진으로 중앙 정렬
`;

export const PageNumber = styled.span<{ active: boolean }>`
  margin: 0 29px;
  cursor: pointer;
  position:relative;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;



// RoomCardComponent.tsx

export const RoomBackground = styled.div<{ status: string }>`
position: absolute; // RoomContainer의 뒤에 위치
  width: 100%;
  height: 100%;
  background-image: url(${() => `/assets/Tetris_back${Math.floor(Math.random() * 5) + 1}.png`});
  background-size: cover;
  background-position: center;
  border-radius: 50px; // 모서리 둥글게
  filter: ${({ status }) => 
    status === '대기 중' ? 'grayscale(0%)' : 
    status === '준비 중' ? 'grayscale(80%)' : 'grayscale(100%)'};
    transition: filter 0.3s ease; // 부드러운 필터 전환 효과
  
    // 클래스 이름 지정
    &.room-background {
      // RoomContainer의 hover 효과에 의해 이 스타일이 적용됩니다.
    }  
`;

export const RoomContainer = styled.div`
  position: relative;
  width: 200px; // 카드 너비
  height: 300px; // 카드 높이
  top:10vw;
  right:2vw;
  display: flex;
  flex-direction: column;
  
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 ); // z-index를 통해 겹치는 순서 제어
  border-radius: 50px; // 모서리 둥글게
  transition: transform 0.3s ease, box-shadow 0.3s ease; // 부드러운 전환 효과
  &:hover {
    transform: translateY(-10px) scale(1.05); // 위로 올라가면서 약간 커지는 효과
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); // 그림자 효과
    .room-background {
      filter: grayscale(0%); // grayscale을 0으로 설정
    }
  }
 
}
`;
export const RoomTitleContainer = styled.div`
position: relative;
top:22vh;
  height: 37%; // 전체 컨테이너의 40%
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba( 255, 255, 255, 0.25 );
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 9px );
-webkit-backdrop-filter: blur( 9px );
border-radius: 0 0 50px 50px; // 하단 좌우 모서리만 둥글게

border: 1px solid rgba( 255, 255, 255, 0.18 );
  z-index:1;
`;

export const RoomTitle = styled.h3`
position:relative;
right: 1vw;
top: 2.5vh;
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
`;

export const RoomStatus = styled.div<{ status: string }>`
  display: inline-block; // 인라인 블록 요소로 변경
  position: relative;
  top:1.8vh;
  scale:0.7;
  left:3.2vw;
  padding: 5px 10px; // 안쪽 여백 추가
  border-radius: 20px; // 원형 모양으로 만들기 위해
  color: #666;
  margin-bottom: 10px;
  background-color: ${({ status }) => {
    switch (status) {
      case '대기 중':
        return '#f0f0f0'; // 옅은 회색
      case '준비 중':
        return '#fffacd'; // 옅은 노란색
      case '게임 중':
        return '#add8e6'; // 옅은 파란색
      default:
        return 'transparent'; // 기본값: 투명
    }
  }};
`;

export const RoomCreateProfile = styled.img`
position: relative;
right:3.5vw;
top:1vh;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-bottom: 10px;
  
`;

export const RoomCreateNickname = styled.div`
  position: relative;
  right: 0.7vw;
  bottom: 3.3vh;
  color: #666;
  font-size: 12px;
  background-color: white;
  padding: 7px 10px; // 안쪽 여백을 추가하여 원형이 더 크게 보이도록 조정
  border-radius: 50px; // 완벽한 원형을 만들기 위해 50%로 설정
  display: inline-block; // 인라인 블록 요소로 변경하여 콘텐츠 크기에 맞게 요소의 크기가 조정되도록 함
  white-space: nowrap; // 닉네임 텍스트가 줄바꿈 되지 않도록 설정
`;

export const GameMainContainer = styled.div`
  position:relative;
  bottom:5vh;

`;

export const RoomCount = styled.div`
position: relative;
left: 3vw;
bottom: 6vh;
color: #666;
font-size: 12px;
background-color: white;
padding: 8px 10px; // 안쪽 여백을 추가하여 원형이 더 크게 보이도록 조정
border-radius: 50px; // 완벽한 원형을 만들기 위해 50%로 설정
`;

// GameLobby

export const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px); // 3개의 칼럼, 각 칼럼의 너비 100px
  row-gap: 50px; // 행 사이의 간격
  column-gap: 200px; // 열 사이의 간격
  padding: 20px;
  justify-content: center; // 그리드를 가로 방향으로 중앙 정렬
  margin: auto; // 그리드를 세로 방향으로 중앙 정렬
`;

// 스타일 컴포넌트 파일 (예: src/Styled.tsx)


export const PaginationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: fixed; // 페이지 이동에도 위치 고정
  top: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-size: contain;
  border: none;
  outline: none;
  background-color: transparent;
  transition: transform 0.3s ease-in-out;
  ${({ direction }) => direction === 'left' && `
    left: 20vw;
    background-image: url('src/assets/ArrowLeft.png'); // 왼쪽 화살표 이미지
  `}

  ${({ direction }) => direction === 'right' && `
    right:20vw ;
    background-image: url('src/assets/ArrowRight.png'); // 오른쪽 화살표 이미지
  `}
  
  &:hover {
    transform: scale(1.2); // hover 시 이미지 확대
  }
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

`;



export const PageInfo = styled.span`
position:relative;
right: 1vw;
top: 2.5vh;
  font-size: 24px;
`;

// 애니메이션 정의
export const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// 애니메이션 정의
export const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
`;

export const StatusMessage = styled.div<{ status: string, show: boolean }>`
  position: absolute;
  bottom: 20vh;
  width: 10.3vw;
  text-align: center;
  color: white;
  padding: 10px;
  margin-top: 10px;
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')}; // 상태에 따라 보이거나 숨김
  background-color: ${({ status }) =>
    status === '준비 중' ? 'rgba(255, 255, 0, 0.7)' : // 연한 노란색
    status === '게임 중' ? 'rgba(255, 0, 0, 0.7)' : // 연한 빨간색
    'transparent'};
  animation: ${({ show }) => (show ? slideUp : slideDown)} 0.3s ease forwards;



`;
