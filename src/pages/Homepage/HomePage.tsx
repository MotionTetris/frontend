import { useEffect, useRef } from "react";
import { HomepageContainer, HomepageBackgroundVideo } from "./styles";
import LoginModal from "@pages/Homepage/Modal/Login/LoginModal";
import { BlockComponents } from "../../BGtetris";
import { BackgroundColor3, BackgroundColor1, BackgroundColor2, ShootingStar, Night } from "../../BGstyles";

const HomePage: React.FC = () => {
  const shootingStars = Array(20).fill(null).map((_, index) => 
  <ShootingStar 
    style={{ 
      left: `${Math.random() * 100}%`, 
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`
    }} 
    key={index} 
  />);
  return (
    <><HomepageContainer>
      <LoginModal />
    </HomepageContainer>
    <BackgroundColor1>
    <Night>
          {shootingStars}
        </Night>
        {/* {BlockComponents} */}
      </BackgroundColor1></>

  );
}

export default HomePage;
