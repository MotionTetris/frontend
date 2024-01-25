// SidebarComponent.tsx
import { Sidebar, StyledLink } from '../Styled'; // 확장자 .tsx는 생략 가능합니다.

// prop 타입을 위한 인터페이스 정의
interface SidebarComponentProps {
  activePath: string; // activePath prop 타입 지정
}

// 함수 컴포넌트의 props에 타입 적용
const SidebarComponent: React.FC<SidebarComponentProps> = ({ activePath }) => {
  console.log("SidebarComponent: activePath is", activePath);
  return (
    <Sidebar>
      <StyledLink to="/gamelobby" active={activePath === '/gamelobby'} image="src/assets/Home.png">게임 로비</StyledLink>
      <StyledLink to="/gamemain" active={activePath === '/gamemain'} image="src/assets/Lobby.png">게임 시작</StyledLink>
      <StyledLink to="/gamedashboard" active={activePath === '/gamedashboard'} image="src/assets/DashBoard.png">대시보드</StyledLink>
    </Sidebar>
  );
};

export default SidebarComponent;
