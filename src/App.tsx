// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import GameMain from './page/GameMain';
import GameLobby from './page/GameLobby';
import GameDashBoard from './page/GameDashBoard';
import { GlobalStyles } from './GloabalStyles.tsx';
const App = () => {
  return (
    <Router>
    <GlobalStyles />
    <Routes>
      <Route path="/" element={<GameLobby/>} />
      <Route path="/gamemain" element={<GameMain />} />
      <Route path="/gamelobby" element={<GameLobby />} />
      <Route path="/gamedashboard" element={<GameDashBoard />} />
    </Routes>
  </Router>
  );
};

export default App;
