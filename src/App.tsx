// App.jsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GameMain from './page/GameMain';
import GameLobby from './page/GameLobby';
import GameDashBoard from './page/GameDashBoard';
import GameRoom from './page/GameRoom.tsx';
import HomePage from './page/HomePage.tsx';


import { GlobalStyles } from './GloabalStyles.tsx';
const App = () => {
  return (
    <Router>
    <GlobalStyles />
    <Routes>
      <Route path="/gamemain" element={<GameMain />} />
      <Route path="/gamelobby" element={<GameLobby />} />
      <Route path="/gamedashboard" element={<GameDashBoard />} />
      <Route path="/rooms/:roomId" element={<GameRoom />} />
      <Route path="/"element={<HomePage />} />
    </Routes>
  </Router>
  );
};

export default App;
