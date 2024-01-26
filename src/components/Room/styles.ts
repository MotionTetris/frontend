// RoomCardComponent.tsx
import styled, { keyframes }  from 'styled-components';
export const RoomBackground = styled.div<{ status: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${() => `/assets/Tetris_back${Math.floor(Math.random() * 5) + 1}.png`});
  background-size: cover;
  background-position: center;
  border-radius: 50px;
  filter: ${({ status }) => 
    status === '대기 중' ? 'grayscale(0%)' : 
    status === '준비 중' ? 'grayscale(80%)' : 'grayscale(100%)'};
    transition: filter 0.3s ease;
    &.room-background {
    }  
`;

export const RoomContainer = styled.div`
  position: relative;
  width: 200px;
  height: 300px;
  top:10vw;
  right:2vw;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  border-radius: 50px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    .room-background {
      filter: grayscale(0%);
    }
  }
`;
export const RoomTitleContainer = styled.div`
  position: relative;
  top:22vh;
  height: 37%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba( 255, 255, 255, 0.25 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 9px );
  -webkit-backdrop-filter: blur( 9px );
  border-radius: 0 0 50px 50px;
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
  display: inline-block;
  position: relative;
  top:1.8vh;
  scale:0.7;
  left:3.2vw;
  padding: 5px 10px;
  border-radius: 20px;
  color: #666;
  margin-bottom: 10px;
  background-color: ${({ status }) => {
    switch (status) {
      case '대기 중':
        return '#f0f0f0';
      case '준비 중':
        return '#fffacd';
      case '게임 중':
        return '#add8e6';
      default:
        return 'transparent';
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
  padding: 7px 10px;
  border-radius: 50px;
  display: inline-block;
  white-space: nowrap;
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
  padding: 8px 10px;
  border-radius: 50px;
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

export const RoomStatusMessage = styled.div<{ status: string, show: boolean }>`
  position: absolute;
  bottom: 20vh;
  width: 10.3vw;
  text-align: center;
  color: white;
  padding: 10px;
  margin-top: 10px;
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  background-color: ${({ status }) =>
    status === '준비 중' ? 'rgba(255, 255, 0, 0.7)' :
    status === '게임 중' ? 'rgba(255, 0, 0, 0.7)' :
    'transparent'};
  animation: ${({ show }) => (show ? slideUp : slideDown)} 0.3s ease forwards;
`;