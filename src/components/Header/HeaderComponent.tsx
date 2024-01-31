// HeaderComponent.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../../redux/profile/profileSlice';
import { RootState, store } from '@app/store';
import { HeaderContainer, HeaderLogoContainer, HeaderLogo, HeaderLogoTitle, HeaderProfileNickName, HeaderProfilePhoto, HeaderProfileContainer, HeaderStyledLinkContainer, HeaderStyledLink } from './styles';
import { userProfileAPI } from '@api/user';
import defaultProfileImage from '../../assets/ProfilePhoto.png';
import { Navigate } from 'react-router-dom';

const HeaderComponent: React.FC<{ activePath: string }> = ({ activePath }) => {
  const dispatch = useDispatch();
  const currentState = store.getState();
  const profile = useSelector((state: RootState) => state.profile); // Redux store에서 profile 상태를 가져옵니다.

  useEffect(() => {
    const requestUserProfile = async () => {
        try {
          const data = await userProfileAPI(currentState.homepage.nickname);
          dispatch(setProfile(data));
        } catch (error) {
          // 오류 처리
        }
      }
    requestUserProfile();
    const interval = setInterval(requestUserProfile, 600000); 
    return () => clearInterval(interval);
  }, [dispatch, profile.photo, profile.nickname]);

  console.log(currentState.homepage.nickname);
  if (!currentState.homepage.nickname) {
    return <Navigate to="/"></Navigate>
  }

  if (currentState.homepage.nickname === '') {
    return <Navigate to="/"></Navigate>
  }
  
  return (
    <HeaderContainer>
      <HeaderLogoContainer>
        <HeaderLogo src="src/assets/Logo.png" alt="logo" />
        <HeaderLogoTitle>Motion Tetris</HeaderLogoTitle>
      </HeaderLogoContainer>
      <HeaderProfileContainer>
        {/* TODO: Profile images */}
        <HeaderProfilePhoto src={defaultProfileImage} alt="profile"/>
        <HeaderProfileNickName>{currentState.homepage.nickname}</HeaderProfileNickName>
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