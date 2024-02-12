import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from "react-router-dom";

import GameMain from "./pages/Main/GameMain";
import GameLobby from "./pages/Lobby/GameLobby";
import GameDashBoard from "./pages/DashBoard/GameDashBoard";
import HomePage from "./pages/Homepage/HomePage";
import { GlobalStyles } from "./GloabalStyles";
import Tetris from "@pages/Room/InGame/Tetris";
import { RoomSocketContext, roomSocket } from "./context/roomSocket";
import Header from "./components/Header/Header";
import GameRoom from "@pages/Room/GameRoom";
import TetrisSingle from "@pages/Room/InGame/TetrisSingle";
import { getExpiresAt, getUserNickname, removeToken } from "./data-store/token";
const WithHeader: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => (
  <>
    <Header />
    <Component />
  </>
);
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = getUserNickname();
  
  if (token) {
    const now = Math.floor(Date.now() / 1000);
    if (getExpiresAt() === 0) {
      removeToken();
      alert("로그인이 만료되었습니다.");
      return children;
    }

    if (getExpiresAt() < now) {
      removeToken();
      alert("로그인이 만료되었습니다.");
      return children;
    }

    return <Navigate to="/gamelobby" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <RoomSocketContext.Provider value={roomSocket}>
        <Routes>
          <Route path="/gamemain" element={<WithHeader component={GameMain} />} />
          <Route path="/gamelobby" element={<WithHeader component={GameLobby} />} />
          <Route path="/gamedashboard" element={<WithHeader component={GameDashBoard} />} />
          <Route path="/rooms/:roomId" element={<GameRoom/>} />
          <Route path="/gameplay" element={<Tetris />} />
          <Route path="/singleplay" element={<TetrisSingle />} />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
        </Routes>
      </RoomSocketContext.Provider>
    </Router>
  );
};

export default App;
