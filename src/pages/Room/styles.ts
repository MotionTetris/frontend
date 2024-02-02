// StyledComponents.ts
import styled from "styled-components";

interface PlayerStatusProps {
  playerstatus: "WAIT" | "READY" | "START";
}
export const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
  position: relative; // 상대적 위치
`;

export const TetrisBackButton = styled.button`
  position: absolute;
  top: 2%;
  right: 80%;
  width: 20%;
  height: 10%;
  background: lightgray;
`;

export const GameRoomId = styled.span`
  position: absolute;
  top: 2%;
  right: 2%;
  width: 10%;
  height: 5%;
  background: lightblue;
`;

export const GameRoomTitle = styled.span`
  position: absolute;
  top: 2%;
  right: 2%;
  width: 10%;
  height: 5%;
  background: lightblue;
`;

export const TetrisSingle = styled.div`
  position: absolute;
  top: 2%;
  right: 2%;
  width: 10%;
  height: 5%;
  background: lightblue;
`;

export const TetrisPlayer = styled.div`
  position: relative;
  bottom: 35.8vh;
  left: 30vh;
  width: 30vw;
  height: 10vh;
  border: 2px solid black;
  border-top-left-radius: 50px; // 왼쪽 상단 코너에 대한 radius 설정
  border-top-right-radius: 50px; // 오른쪽 상단 코너에 대한 radius 설정
  background: lightgray;
  scale: 0.8;
`;

export const PlayerNickName = styled.span`
  position: absolute;
  top: 3.3vh;
  left: 7.5vw;
  padding: 0.5em 1em; // 텍스트와 테두리 사이의 여백을 설정
  border: 2px solid #ffffff; // 테두리 색상을 흰색으로 설정
  border-radius: 20px; // 둥근 모서리 효과
  background-color: rgba(
    255,
    255,
    255,
    0.2
  ); // 배경색을 흰색의 투명도 20%로 설정
  transition: box-shadow 0.3s; // smooth transition for the glow effect

  &:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); // hover 시에 glow 효과
  }
`;

export const PlayerBackground = styled.img`
  position: absolute;
  bottom: 0vh;
  left: 0vh;
  width: 30vw;
  opacity: 0.8;
  height: 10vh;
  border-top-left-radius: 50px; // 왼쪽 상단 코너에 대한 radius 설정
  border-top-right-radius: 50px; // 오른쪽 상단 코너에 대한 radius 설정
  background: lightgray;
`;

export const PlayerProficture = styled.img`
  position: absolute;
  top: 1.5vh;
  left: 3vw;
  scale: 0.9;
`;

export const PlayerStatus = styled.span<PlayerStatusProps>`
  position: absolute;
  top: 2.5vh;
  right: 4vw;
  width: 20%;
  height: 5%;
  display: flex; // flexbox를 사용하여 아이템을 정렬
  align-items: center; // 수직 방향으로 중앙 정렬
  justify-content: center; // 수평 방향으로 중앙 정렬
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  font-size: 24px;
  background-color: ${(props) =>
    props.playerstatus === "READY" ? "green" : "gray"}; // 배경색 조건부 설정
  color: white; // 텍스트 색상 설정
  border-radius: 50px; // 모서리 둥글게
  padding: 20px 10px; // 안쪽 여백 설정
  transition:
    background-color 0.3s,
    transform 0.3s; // 배경색과 변형에 애니메이션 효과 적용
`;

export const TetrisNextBlock = styled.div`
  position: absolute;
  top: 12.4vh;
  right: 15.5vw;
  width: 23vw;
  height: 9.1vh;
  border: 2px solid black;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  font-size: 20px;
  color: lightblue;
  background: gray;
`;

export const VideoContainer = styled.video`
  position: absolute;
  top: 10vh;
  left: -0.1vw;
  width: 30vw;
  height: 90vh;
  border: 2px solid black;
  border-radius: 0px;
  object-fit: cover;
`;

export const TetrisCanvas = styled.canvas`
  position: relative;
`;

export const MotionContainer = styled.div`
  position: absolute;
  right: 15.5vw;
  top: 21.7vh;
  width: 23vw;
  height: 68.5vh;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Motion = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

export const MotionDot = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/* Start 버튼은 Role이 'Creator'에게만 보인다' */
export const StartButton = styled.button`
  position: absolute;
  bottom: 20vh;
  right: 6vw;
  width: 8%;
  height: 5%;
  background-color: #ff4d4d; // 찐한 빨간색 대신 조금 더 부드러운 색상 사용
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; // 텍스트 색상 설정
  font-size: 1em; // 텍스트 크기 설정
  cursor: pointer; // 마우스 오버시 커서 변경
  border: none; // 테두리 제거
  border-radius: 5px; // 버튼 모서리 둥글게
  transition:
    background-color 0.3s,
    box-shadow 0.3s; // 배경색 및 그림자 변화에 애니메이션 효과

  &:hover {
    background-color: #ff6666; // 호버 시 색상을 더 부드럽게 변경
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.1); // 호버 시 빨간색 glow 효과
  }
`;

export const ReadyButton = styled.span`
  position: absolute;
  bottom: 10vh;
  right: 6vw;
  width: 8%;
  height: 5%;
  background-color: gray;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1em;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: "darkgreen";
  }
`;
