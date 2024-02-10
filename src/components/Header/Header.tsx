import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "@redux/profile/profileSlice";
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
import defaultProfileImage from "@assets/ProfilePhoto.png";
import { BackgroundColor3 } from "@src/BGstyles"
import { useLocation } from "react-router-dom";
import Volume from "@components/volume";
import { getUserNickname } from "@src/data-store/token";

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
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState("");

  const backgroundCircles = useMemo(() => (
    <BackgroundColor3></BackgroundColor3>
    ), []);
    useEffect(() => {
        try {
          const nickname = getUserNickname();
          if (nickname) {
            console.log('Decoded nickname:', nickname);
            setNickname(nickname);
            dispatch(setProfile({ nickname: nickname }));
          }
        } catch (error) {
          console.error('An error occurred while decoding the token:', error);
        }
    }, [dispatch]);

  return (
    <>
      {backgroundCircles}
      <HeaderContainer>
      <Volume page = 'page2'/>
        <HeaderLogoContainer>
          <HeaderLogo src="src/assets/Logo.png" alt="logo" />
          <HeaderLogoTitle>Motion Tetris</HeaderLogoTitle>
        </HeaderLogoContainer>
        <HeaderProfileContainer>
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
