import { useState} from "react";
import {
  AnimatedSection,
  HomepagesubTitle,
  Icon,
  HomepageInnerContainer,
  HomepageDiv,
  EmailInputField,
  PasswordInputField,
  HomepageTitle,
  EmailInputString,
  PasswordInputString,
  HomepageLoginButton,
  HomepageGuestLoginButton,
  HomepageSignupButton,
  HomepageContainer,
} from "./styles";
import SignupModal from "@pages/Homepage/Modal/Signup/SignupModal";
import { useDispatch } from "react-redux";
import { setUser } from "@redux/hompage/homepageSlice";
import { guestLogin, loginAPI } from "@api/auth";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { setToken } from "@src/data-store/token";
import { playLoginSound } from "@src/components/sound";
const LoginModal: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      
      console.log(response.access_token);
      dispatch(
        setUser({
          nickname: response.nickname,
          email: response.email,
        }),
      );
      setToken(response.access_token);
      playLoginSound();
      navigate("/gamelobby");
    } catch (error) {
      console.log(error);
      alert("아이디 또는 비밀번호가 다릅니다.");
    }
  };

  const handleGuestLogin = async () => {
    console.log("Guest login");
    try {
      const response = await guestLogin();
      dispatch(setUser({nickname: response.nickname, email: response.email}));
      setToken(response.access_token);
      playLoginSound();
      navigate("/gamelobby");
    } catch (error) {
      console.log(error);
      alert("게스트 로그인에 실패하였습니다.");
    }
  };

  const handleSignup = () => {
    setSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };

  return (
    <HomepageDiv>
      <AnimatedSection $fadein={!isSignupModalOpen}>
        <HomepageContainer>
          <HomepageInnerContainer>
            <HomepageTitle>환영합니다!🎉</HomepageTitle>
            <HomepagesubTitle>
              모션으로 테트리스 블록을 움직이세요!
            </HomepagesubTitle>
            <form onSubmit={handleLogin}>
              <EmailInputString>
                <EmailInputField
                  type="text"
                  value={email}
                  onChange={handleUsernameChange}
                  placeholder="닉네임"
                />
                <Icon>
                  <FaUserAlt />
                </Icon>
              </EmailInputString>
              <PasswordInputString>
                <PasswordInputField
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  minLength={8}
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                  title="적어도 하나의 숫자와 대문자, 소문자를 포함해야 하며, 길이는 최소 8자 이상이어야 합니다."
                  placeholder="비밀번호"
                />
                <Icon>
                  <RiLockPasswordFill />
                </Icon>
              </PasswordInputString>
              <HomepageLoginButton type="submit">로그인</HomepageLoginButton>
            </form>
            <HomepageGuestLoginButton onClick={handleGuestLogin}>
              게스트 로그인
            </HomepageGuestLoginButton>
            <HomepageSignupButton onClick={handleSignup}>
              회원가입
            </HomepageSignupButton>
          </HomepageInnerContainer>
        </HomepageContainer>
      </AnimatedSection>
      <AnimatedSection $fadein={isSignupModalOpen}>
        {isSignupModalOpen && <SignupModal onClose={closeSignupModal} />}
      </AnimatedSection>
    </HomepageDiv>
  );
}
export default LoginModal;