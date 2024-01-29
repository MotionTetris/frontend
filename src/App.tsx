// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './app/store'; // 상태 타입을 가져옵니다.

import GameMain from './pages/Main/GameMain';
import GameLobby from './pages/Lobby/GameLobby';
import GameDashBoard from './pages/DashBoard/GameDashBoard';
import GameRoom from './pages/Room/GameRoom';
import HomePage from './pages/Homepage/HomePage';
import { GlobalStyles } from './GloabalStyles';

interface RequireAuthProps {
  children: React.ReactElement;
}

// 인증이 필요한 컴포넌트를 렌더링하기 전에 인증 상태를 확인하는 컴포넌트
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.homepage.isAuthenticated);

  if (!isAuthenticated) {
    // 인증되지 않았다면 홈페이지로 리디렉션
    return <Navigate to="/" replace />;
  }

  return children; // 인증된 경우 자식 컴포넌트를 렌더링합니다.
};

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/gamemain" element={
          <RequireAuth>
            <GameMain />
          </RequireAuth>
        } />
        <Route path="/gamelobby" element={
          <RequireAuth>
            <GameLobby />
          </RequireAuth>
        } />
        <Route path="/gamedashboard" element={
          <RequireAuth>
            <GameDashBoard />
          </RequireAuth>
        } />
        <Route path="/rooms/:roomId" element={
          <RequireAuth>
            <GameRoom />
          </RequireAuth>
        } />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
