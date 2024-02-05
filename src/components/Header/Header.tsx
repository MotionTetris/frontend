// Header.tsx
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../../redux/profile/profileSlice";
import { RootState, store } from "@app/store";
import {
  HeaderContainer,
  HeaderLogoContainer,
  HeaderLogo,
  HeaderLogoTitle,
  HeaderProfileNickName,
  HeaderProfilePhoto,
  HeaderProfileContainer,
  HeaderStyledLinkContainer,
  HeaderStyledLink as OriginalHeaderStyledLink,
} from "./styles";
import { userProfileAPI } from "@api/user";
import defaultProfileImage from "../../assets/ProfilePhoto.png";
import { Navigate } from "react-router-dom";
import {BackgroundColor3, Circle} from "../../BGstyles"
import {BlockComponents} from "../../BGtetris"
import { useLocation } from "react-router-dom";

const HeaderStyledLink: React.FC<{ to: string, image: string, children: React.ReactNode }> = ({ to, children, image }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <OriginalHeaderStyledLink to={to} active={active} image={image}>
      {children}
    </OriginalHeaderStyledLink>
  );
};

const Header: React.FC = () => {
  const nickname = useSelector((state: RootState) => state.homepage.nickname);
 
  useEffect(() => {
    console.log('header nickname::::::',nickname)
  }, []); // 의존성 배열에 nickname 추가

  const backgroundCircles = useMemo(() => (
    <BackgroundColor3></BackgroundColor3>
    ), []);


  return (
    <>
      {backgroundCircles}
      <HeaderContainer>
        <HeaderLogoContainer>
          <HeaderLogo src="src/assets/Logo.png" alt="logo" />
          <HeaderLogoTitle>Motion Tetris</HeaderLogoTitle>
        </HeaderLogoContainer>
        <HeaderProfileContainer>
          {/* TODO: Profile images */}
          <HeaderProfilePhoto src={defaultProfileImage} alt="profile" />
          <HeaderProfileNickName>
            {nickname}
          </HeaderProfileNickName>
        </HeaderProfileContainer>
        <HeaderStyledLinkContainer>
          <HeaderStyledLink
            to="/gamelobby"
            image="src/assets/Home.png"
          >
            게임 로비
          </HeaderStyledLink>
          <HeaderStyledLink
            to="/gamemain"
            image="src/assets/Lobby.png"
          >
            게임 시작
          </HeaderStyledLink>
          <HeaderStyledLink
            to="/gamedashboard"
            image="src/assets/DashBoard.png"
          >
            대시보드
          </HeaderStyledLink>
        </HeaderStyledLinkContainer>
      </HeaderContainer>
    </>
  );
};

export default React.memo(Header);
