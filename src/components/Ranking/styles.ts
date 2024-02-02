// RankingComponent
import styled from "styled-components";

export const RankButton = styled.button<{ direction: "left" | "right" }>`
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
    left: 1vw;
    background-image: url('src/assets/ArrowLeft.png');
  `}

  ${({ direction }) =>
    direction === "right" &&
    `
    right:1vw ;
    background-image: url('src/assets/ArrowRight.png');
  `}
  
  &:hover {
    transform: scale(1.2);
  }
`;

export const RankSection = styled.div`
  display: flex;
  position: relative;
  left: 25vw;
  bottom: 5vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50vw;
  height: 110vh;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

export const RankContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50vw;
  top: 0vh;
  left: 0.5vw;
  position: relative;
  overflow-x: hidden;
  background-color: transparent;
  padding: 20px;
`;

export const RankBar = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  scale: 0.8;
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transform: translateY(-3px);
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

export const Rank = styled.span`
  font-size: 20px;
  margin-right: 60px;
  width: 50px;
  text-align: center;
`;

export const RankUsername = styled.span`
  flex-grow: 1;
  margin-right: 10px;
`;

export const RankScore = styled.span`
  font-weight: bold;
  position: absolute;
  width: 100px;
  right: 100px;
`;

export const RankLabelsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 60vw;
  margin: auto;
  left: 5vw;
  bottom: 2vh;
`;

export const RankLabel = styled.p`
  font-size: 18px;
  color: #666;
  font-weight: bold;
  margin: 0 12px;
  &[data-label="rank"] {
    margin-right: 6vw;
  }

  &[data-label="username"] {
    margin-right: 19vw;
  }
`;

export const RankPaginationContainer = styled.div`
  position: relative;
  display: flex;
  width: 60vw;
  margin: auto;
`;

export const RankPageNumber = styled.span<{ active: boolean }>`
  margin: 0 29px;
  cursor: pointer;
  position: relative;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
`;
