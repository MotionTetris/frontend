import styled from "styled-components";

export const PlayerContainer = styled.div`
  position: relative;
  bottom: 35.8vh;
  left: 40vh;
  width: 1200px;
  height: 10vh;
  border: 2px solid black;
  border-radius: 50px;
  background-color: white;
  transform: scale(0.8);
`;

export const PlayerNickName = styled.span`
  position: absolute;
  top: 1.2vh;
  left: 5vw;
  padding: 0.5em 1em;
  border: 2px solid gray;
  border-radius: 20px;
  background-color: transparent;
  transition: box-shadow 0.3s;
  display: flex;
  align-items: center;
  transform: scale(0.9);
  font-size: 30px;
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
  bottom: 0.9vw;
  right: 3vw;
  background-color: red;
  color: white;
  padding: 10px 10px;
  margin-left: 5px;
  border-radius: 5px;
  font-size: 30px;
`;