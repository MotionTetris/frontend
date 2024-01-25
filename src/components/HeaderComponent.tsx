// src/components/HeaderComponent.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../features/profile/profileSlice';
import { RootState,SidebarComponentProps } from '../app/store';
import { Header, LogoContainer, Logo, LogoTitle, ProfileNickName, ProfilePhoto, ProfileContainer, StyledLinkContainer, StyledLink } from '../Styled.tsx';


const HeaderComponent: React.FC<SidebarComponentProps> = ({ activePath }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    const fetchProfile = () => {
      if (!profile.photo && !profile.nickname) { // 프로필 정보가 비어있는 경우에만 요청
        fetch('/api/profile')
          .then((response) => response.json())
          .then((data) => {
            dispatch(setProfile(data));
          })
          .catch((error) => {
            console.error('Client: Error fetching /api/profile', error);
          });
      }
    };

    fetchProfile(); // 컴포넌트 마운트 시 프로필 정보 가져오기

    const interval = setInterval(fetchProfile, 600000); // 10분마다 프로필 정보 업데이트

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, [dispatch, profile.photo, profile.nickname]); // 의존성 배열에 프로필 정보 추가

  return (
    <Header>
      <LogoContainer>
        <Logo src="src/assets/Logo.png" alt="logo" />
        <LogoTitle>Motion Tetris</LogoTitle>
      </LogoContainer>
      <ProfileContainer>
        <ProfilePhoto src={profile.photo} alt="profile" />
        <ProfileNickName>{profile.nickname}</ProfileNickName>
      </ProfileContainer>
      <StyledLinkContainer>
        <StyledLink to="/gamelobby" active={activePath === '/gamelobby'} image="src/assets/Home.png">게임 로비</StyledLink>
        <StyledLink to="/gamemain" active={activePath === '/gamemain'} image="src/assets/Lobby.png">게임 시작</StyledLink>
        <StyledLink to="/gamedashboard" active={activePath === '/gamedashboard'} image="src/assets/DashBoard.png">대시보드</StyledLink>
      </StyledLinkContainer>
    </Header>
  );
};

export default React.memo(HeaderComponent);