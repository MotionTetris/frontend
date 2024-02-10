import BannerComponent from "@components/Banner/Banner";
import { LobbyContainer } from "./styles";
import { useRoomSocket } from "@src/context/roomSocket";

const GameLobby = () => {
  useRoomSocket();
  return (
    <LobbyContainer>
      <BannerComponent />
    </LobbyContainer>
  );
};
export default GameLobby;
