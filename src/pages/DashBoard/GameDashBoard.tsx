// GameDashBoard.tsx
import { useState } from 'react';
import HeaderComponent from '@components/Header/HeaderComponent';
import { GameDashboardContainer } from './styles';

const GameDashboard = () => {
  const [activePath] = useState('/gamedashboard');

  return (
    <GameDashboardContainer>
      <HeaderComponent activePath={activePath} />
    </GameDashboardContainer>
  );
};

export default GameDashboard;
