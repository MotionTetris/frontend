// RoomCardComponent.tsx
import styled from "styled-components";
export const RoomBackground = styled.div<{
  status: "READY" | "START" | "WAIT";
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 50px;
  filter: ${({ status }) =>
    status === "WAIT"
      ? "grayscale(0%)"
      : status === "READY"
        ? "grayscale(80%)"
        : "grayscale(100%)"};
  transition: filter 0.3s ease;
  &.room-background {
  }
`;

export const RoomContainer = styled.div`
  position: relative;
  width: 200px;
  height: 300px;
  top: 10vw;
  right: 2vw;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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
  top: 22vh;
  height: 37%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  border-radius: 0 0 50px 50px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
`;

export const RoomTitle = styled.h3`
  position: relative;
  right: 1vw;
  top: 2.5vh;
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
`;

export const RoomId = styled.h3`
  position: relative;
  right: 1vw;
  top: 2.5vh;
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
`;

export const RoomStatus = styled.div<{ status: "READY" | "START" | "WAIT" }>`
  display: inline-block;
  position: relative;
  top: 1.8vh;
  scale: 0.7;
  left: 3.2vw;
  padding: 5px 10px;
  border-radius: 20px;
  color: #666;
  margin-bottom: 10px;
  background-color: ${({ status }) => {
    switch (status) {
      case "WAIT":
        return "#f0f0f0";
      case "READY":
        return "#fffacd";
      case "START":
        return "#add8e6";
      default:
        return "transparent";
    }
  }};
`;

export const RoomCreateProfile = styled.img`
  position: relative;
  right: 3.5vw;
  top: 1vh;
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
  position: relative;
  bottom: 5vh;
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

export const RoomStatusMessage = styled.div`
  position: absolute;
  bottom: 20vh;
  width: 10.3vw;
  text-align: center;
  color: white;
  padding: 10px;
  margin-top: 10px;
  background-color: red;
`;
