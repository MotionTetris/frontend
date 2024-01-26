//GameMain.tsx
//GameMain
import styled from 'styled-components';

export const GameRoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px); // 3개의 칼럼, 각 칼럼의 너비 100px
  row-gap: 50px;
  column-gap: 200px;
  padding: 20px;
  justify-content: center;
  margin: auto;
`;

export const GameContainer = styled.div`
  position:relative;
  bottom:5vh;
`;

export const GamePaginationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: fixed;
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
    transform: scale(1.2);
  }
`;

export const GamePagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

`;

