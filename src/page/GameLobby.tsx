// GameLobby.tsx
import { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import BannerComponent from '../components/BannerComponent';
import RankingComponent from '../components/RankingComponent';
const GameLobby = () => {
    const [activePath] = useState('/gamelobby')
    return (
      <div>
      <HeaderComponent activePath={activePath}/>
      <BannerComponent />
      <RankingComponent/>

      </div>
    );
  };
  
  export default GameLobby;
  