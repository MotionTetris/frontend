// HeaderComponent.tsx
import { Header, LogoContainer, Logo, LogoTitle, ProfileNickName, ProfilePhoto, ProfileContainer,StyledLinkContainer, StyledLink } from '../Styled.tsx';
import { useEffect, useState } from 'react';

// prop 타입을 위한 인터페이스 정의
interface SidebarComponentProps {
  activePath: string; // activePath prop 타입 지정
}

const HeaderComponent : React.FC<SidebarComponentProps> = ({ activePath }) => {
  const [profile, setProfile] = useState({ photo: '', nickname: '' });

  useEffect(() => {
    fetch('/api/profile')
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        console.error('Client: Error fetching /api/profile', error);
      });
  }, []);
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

export default HeaderComponent;