import { useState } from 'react';
import HeaderComponent from '@components/Header/HeaderComponent';
import BannerComponent from '@components/Banner/BannerComponent';
// import RankingComponent from '@components/Ranking/RankingComponent';

const GameLobby = () => {
    const [activePath] = useState('/gamelobby')
    return (
      <div>
      <HeaderComponent activePath={activePath}/>
      <BannerComponent />
      {/* <RankingComponent/> */}
      </div>
    );
  };
export default GameLobby;
  