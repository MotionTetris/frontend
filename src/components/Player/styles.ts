// StyledComponents.ts
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
  background: lightgray;
  scale: 0.8;
`;

export const PlayerNickName = styled.span`
  position: absolute;
  top: 3.3vh;
  left: 7.5vw;
  padding: 0.5em 1em;
  border: 2px solid #ffffff;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

export const PlayerBackground = styled.img`
  position: absolute;
  bottom: 0vh;
  left: 0vh;
  width: 30vw;
  opacity: 0.8;
  height: 10vh;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  background: lightgray;
`;

export const PlayerProficture = styled.img`
  position: absolute;
  top: 1.5vh;
  left: 3vw;
  scale: 0.9;
`;

export const PlayerStatus = styled.span`
  position: absolute;
  top: 2.5vh;
  right: 4vw;
  width: 20%;
  height: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  font-size: 24px;
  background-color: gray;
  color: white;
  border-radius: 50px;
  padding: 20px 10px;
  transition:
    background-color 0.3s,
    transform 0.3s;
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
