import styled from "styled-components";

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
  position: fixed;
  top: 0%;
  left: 30%;
`;

export const GamePaginationButton = styled.button<{
  direction: "left" | "right";
}>`
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
  ${({ direction }) =>
    direction === "left" &&
    `
    left: 20vw;
    background-image: url('src/assets/ArrowLeft.png'); // 왼쪽 화살표 이미지
  `}

  ${({ direction }) =>
    direction === "right" &&
    `
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

export const ButtonContainer = styled.div`
  position: absolute;
  right: -300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CreateRoomButton = styled.button`
  position: relative;
  top: 140px;
  right: -100px;
  width: 120px;
  height: 50px;
  background-color: white; 
  color: #8A2BE2;
  font-size: 24px;
  font-family: 'MaplestoryOTFBold';
  border: 1px solid #8A2BE2;;
  border-radius: 5px;
  scale: 1.4;
  margin-top: 40px;
  transition:
    background-color 0.3s,
    box-shadow 0.3s,
    color 0.3s,
    border-color 0.3s;
  &:hover {
    background-color: #9370DB;
    color: white;
    border-color: #9370DB;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.1);
  }
`;

