import styled from "styled-components";

export const PlayerContainer = styled.div`
  position: relative;
  bottom: 35.8vh;
  left: 30vh;
  width: 30vw;
  height: 10vh;
  border: 2px solid black;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  background-color: white;
  transform: scale(0.8);
`;

export const PlayerNickName = styled.span`
  position: absolute;
  top: 2.8vh;
  left: 8vw;
  padding: 0.5em 1em;
  border: 2px solid gray;
  border-radius: 20px;
  background-color: transparent;
  transition: box-shadow 0.3s;
  display: flex; // 추가
  align-items: center; // 추가
  transform: scale(1.2);
  &:hover {
    box-shadow: 0 0 3px black;
  }
`;

export const PlayerBackground = styled.div`
  width: 100%;
  height: 100%;

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

export const Badge = styled.span`
  position: absolute;
  bottom: 1.2vw;
  right: 3vw;
  background-color: red;
  color: white;
  padding: 10px 10px;
  margin-left: 5px;
  border-radius: 5px;
  font-size: 1em;
`;