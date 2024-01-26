// HeaderComponent.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '@features/profile/profileSlice';
import { RootState,SidebarComponentProps } from '@app/store';
import { HeaderContainer, HeaderLogoContainer, HeaderLogo, HeaderLogoTitle, HeaderProfileNickName, HeaderProfilePhoto, HeaderProfileContainer, HeaderStyledLinkContainer, HeaderStyledLink } from './styles';
import { userprofileAPI } from '@api/user';

const HeaderComponent: React.FC<SidebarComponentProps> = ({ activePath }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    const userprofile = async () => {
      if (!profile.photo && !profile.nickname) {
        try {
          const data = await userprofileAPI();
          dispatch(setProfile(data));
        } catch (error) {
          // 오류 처리
        }
      }
    };
    userprofile();
    const interval = setInterval(userprofile, 600000); 
    return () => clearInterval(interval);
  }, [dispatch, profile.photo, profile.nickname]);

  return (
    <HeaderContainer>
      <HeaderLogoContainer>
        <HeaderLogo src="src/assets/Logo.png" alt="logo" />
        <HeaderLogoTitle>Motion Tetris</HeaderLogoTitle>
      </HeaderLogoContainer>
      <HeaderProfileContainer>
        <HeaderProfilePhoto src={profile.photo} alt="profile" />
        <HeaderProfileNickName>{profile.nickname}</HeaderProfileNickName>
      </HeaderProfileContainer>
      <HeaderStyledLinkContainer>
        <HeaderStyledLink to="/gamelobby" active={activePath === '/gamelobby'} image="src/assets/Home.png">게임 로비</HeaderStyledLink>
        <HeaderStyledLink to="/gamemain" active={activePath === '/gamemain'} image="src/assets/Lobby.png">게임 시작</HeaderStyledLink>
        <HeaderStyledLink to="/gamedashboard" active={activePath === '/gamedashboard'} image="src/assets/DashBoard.png">대시보드</HeaderStyledLink>
      </HeaderStyledLinkContainer>
    </HeaderContainer>
  );
};

export default React.memo(HeaderComponent);