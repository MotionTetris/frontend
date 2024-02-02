import { useState } from "react";
import HeaderComponent from "@components/Header/Header";
import BannerComponent from "@components/Banner/Banner";
import { LobbyContainer } from "./styles";

const GameLobby = () => {
  const [activePath] = useState("/gamelobby");
  return (
    <LobbyContainer>
      <HeaderComponent activePath={activePath} />
      <BannerComponent />
    </LobbyContainer>
  );
};
export default GameLobby;
