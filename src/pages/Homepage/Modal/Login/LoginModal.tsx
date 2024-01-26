import { useState } from 'react';
import { AnimatedSection, HomepagesubTitle, Icon, HomepageInnerContainer,HomepageDiv, EmailInputField, PasswordInputField, HomepageTitle, EmailInputString, PasswordInputString, HomepageLoginButton,HomepageGuestLoginButton, HomepageSignupButton, HomepageContainer  } from './styles';
import SignupModal from '@pages/Homepage/Modal/Signup/SignupModal'
import { useDispatch } from 'react-redux';
import { setUser } from '@features/hompage/homepageSlice';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '@api/auth';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";


function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await loginAPI(email, password);
      if (response.status === 200) {
        dispatch(setUser({ email: email, isAuthenticated: true }));
        alert('로그인 성공!');
        navigate('/GameLobby');
      } else {
        alert('로그인 실패!');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      alert('로그인 요청 실패!');
    }
  };

  const handleGuestLogin = () => {
    console.log('Guest login');
    // 게스트 로그인 로직
  };

  const handleSignup = () => {
    setSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  }

  return (
    <HomepageDiv>
    <AnimatedSection fadeIn={!isSignupModalOpen}>
    <HomepageContainer>
      <HomepageInnerContainer>
      <HomepageTitle>환영합니다!🎉</HomepageTitle>
      <HomepagesubTitle>모션으로 테트리스 블록을 움직이세요!</HomepagesubTitle>
      <form onSubmit={handleLogin}>
        <EmailInputString>
          <EmailInputField type="text" value={email} onChange={handleUsernameChange} placeholder="이메일" />
          <Icon><MdEmail /></Icon>
        </EmailInputString>
        <PasswordInputString>
          <PasswordInputField
            type="password"
            value={password}
            onChange={handlePasswordChange}
            minLength={8}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            placeholder="비밀번호"
          />
          <Icon><RiLockPasswordFill/></Icon>
        </PasswordInputString>
        <HomepageLoginButton type="submit">로그인</HomepageLoginButton>
      </form>
      <HomepageGuestLoginButton onClick={handleGuestLogin}>게스트 로그인</HomepageGuestLoginButton>
      <HomepageSignupButton onClick={handleSignup}>회원가입</HomepageSignupButton>
    </HomepageInnerContainer>
    </HomepageContainer>
  </AnimatedSection>
  <AnimatedSection fadeIn={isSignupModalOpen}>
    {isSignupModalOpen && <SignupModal onClose={closeSignupModal} />}
  </AnimatedSection>
  </HomepageDiv>
  );
}
export default LoginModal;
