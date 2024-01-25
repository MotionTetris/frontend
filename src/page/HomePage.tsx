import { useEffect, useState } from 'react';
import { HomepageContainer,HomepageInnerContainer, HomepageInputField, HomepageTitle, HomepageInputString, HomepageLoginButton,HomepageGuestLoginButton, HomepageSignupButton  } from '../Styled';
import SignupModal from '../Modal/SignupModal'
import { useDispatch } from 'react-redux';
import { setUser } from '../features/hompage/homepageSlice'; // 경로는 실제 구조에 맞게 조정하세요.
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(src/assets/background1.jpeg)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    return () => {
      document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    };
  }, []);

   const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);

    // 서버에 로그인 요청
    axios.post('/api/login', {
      email: email,
      password: password
    })
    .then(response => {
      console.log(response.data);
      if (response.status === 200) {
        // 로그인 성공시, 사용자 정보를 Redux 스토어에 저장합니다.
        dispatch(setUser({ email: email, isAuthenticated: true })); // setUser 액션 사용
        alert('로그인 성공!');
        navigate('/GameLobby');
      } else {
        alert('로그인 실패!');
      }
    })
    .catch(error => {
      console.error('로그인 요청 실패:', error);
      alert('로그인 요청 실패!');
    });
  };

  const handleGuestLogin = () => {
    console.log('Guest login');
    // 게스트 로그인 로직 (예제에서는 구현하지 않음)
  };

  const handleSignup = (event: React.MouseEvent) => {
    event.preventDefault();
    setSignupModalOpen(true);
    console.log('Signup');
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  }

  
  return (
    <HomepageContainer>
    <HomepageInnerContainer>
      <HomepageTitle>Motion Tetris</HomepageTitle>
      <form onSubmit={handleLogin}>
        <HomepageInputString>
          이메일:
          <br></br>
          <HomepageInputField type="text" value={email} onChange={handleUsernameChange} />
        </HomepageInputString><br></br>
        <HomepageInputString>
          비밀번호:
          <br></br>
          <HomepageInputField
            type="password"
            value={password}
            onChange={handlePasswordChange}
            minLength={8}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
          />
        </HomepageInputString>
        <br></br>
        <HomepageLoginButton type="submit">로그인</HomepageLoginButton>
      </form>
      <HomepageGuestLoginButton onClick={handleGuestLogin}>게스트 로그인</HomepageGuestLoginButton>
      <br></br>
      <HomepageSignupButton onClick={handleSignup}>회원가입</HomepageSignupButton>
      {isSignupModalOpen && <SignupModal onClose={closeSignupModal} />}
    </HomepageInnerContainer>
  </HomepageContainer>
  );
}

export default HomePage;