// src/App.tsx
import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import GameMain from "./pages/Main/GameMain";
import GameLobby from "./pages/Lobby/GameLobby";
import GameDashBoard from "./pages/DashBoard/GameDashBoard";
import HomePage from "./pages/Homepage/HomePage";
import { GlobalStyles } from "./GloabalStyles";
import Tetris from "@pages/Room/InGame/Tetris";
import { RoomSocketContext,createRoomSocket } from "./context/roomSocket";
import Header from "./components/Header/Header";
import * as io from "socket.io-client";
import GameRoom from "@pages/Room/GameRoom";


const WithHeader: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => (
  <>
    <Header />
    <Component />
  </>
);

const App: React.FC = () => {
  const [roomSocket, setRoomSocket] = useState<io.Socket | null>(null);
  return (
    <Router>
      <GlobalStyles />
      <RoomSocketContext.Provider value={{roomSocket, setRoomSocket}}>
        <Routes>
          <Route path="/gamemain" element={<WithHeader component={GameMain} />} />
          <Route path="/gamelobby" element={<WithHeader component={GameLobby} />} />
          <Route path="/gamedashboard" element={<WithHeader component={GameDashBoard} />} />
          <Route path="/rooms/:roomId" element={<GameRoom/>} />
          <Route path="/gameplay" element={<Tetris />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </RoomSocketContext.Provider>
    </Router>
  );
};

export default App;
