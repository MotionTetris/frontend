import { useEffect, useState } from "react";
import { HomepageContainer } from "./styles";
import LoginModal from "@pages/Homepage/Modal/Login/LoginModal";
import { BackgroundColor1, ShootingStar, Night } from "@src/BGstyles";
import Volume from '@components/volume';

const HomePage: React.FC = () => {
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setShootingStars(Array(20).fill(null).map((_, index) => {
      const style = {
        left: `${Math.random() * 100}%`, 
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`
      };
      return <ShootingStar style={style} key={index} />;
    }));
  }, []);

  return (
    <HomepageContainer>
      <LoginModal />
      <Volume page = 'page1'/>
      <BackgroundColor1>
        <Night>
          {shootingStars}
        </Night>
      </BackgroundColor1>
    </HomepageContainer>
  );
}

export default HomePage;
