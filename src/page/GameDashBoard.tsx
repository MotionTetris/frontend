// GameDashBoard.tsx

import { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';
const GameDashboard = () => {
  const [activePath] = useState('/gamedashboard'); // 현재 경로를 상태로 관리

  return (
    <div>
      <HeaderComponent activePath={activePath}/>
    </div>
  );
};

export default GameDashboard;
