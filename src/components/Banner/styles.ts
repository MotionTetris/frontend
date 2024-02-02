// BannerComponent
import styled from "styled-components";

export const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70vw;
  height: 60vh;
  right: 10vw;
  top: 10vh;
  margin-top: calc((100vh - 100px - 280px - 20vh) / 2);
  margin-bottom: calc((100vh - 100px - 280px - 20vh) / 2);
  position: relative;
  border-radius: 2vw;
  box-shadow: 0 2vw 4vw rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: white;
  transition: all 0.5s ease;
`;

export const BannerSlide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.5s ease-in-out;
`;

export const BannerImageWrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
  position: relative;
`;

export const BannerImage = styled.img`
  position: absolute;
  top: 0px;
  left: 00px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease-in-out;
`;

export const BannerArrowButton = styled.button<{ direction: "left" | "right" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 1;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  ${({ direction }) =>
    direction === "left" &&
    `
    left: 10px;
    background-image: url('src/assets/ArrowLeft.png');
  `}

  ${({ direction }) =>
    direction === "right" &&
    `
    right: 10px;
    background-image: url('src/assets/ArrowRight.png');
  `}
`;

export const BannerSlideNumber = styled.div`
  position: absolute;
  bottom: 20px;
  right: 40px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 16px;
`;
