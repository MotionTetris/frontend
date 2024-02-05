import { useState, useEffect} from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../../redux/hompage/homepageSlice";
import { loginAPI } from "@api/auth";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { createRoomSocket, useRoomSocket } from "../../../../context/roomSocket"
import { RootState } from "@app/store";
const LoginModal: React.FC = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {setRoomSocket} = useRoomSocket()

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
          // isAuthenticated: true,
        }),
      );
      localStorage.setItem("token", response.access_token);
      setRoomSocket(createRoomSocket())
      navigate("/GameLobby");
    } catch (error) {
      console.log(error);
      alert("아이디 또는 비밀번호가 다릅니다.");
    }
  };

  const handleGuestLogin = () => {
    console.log("Guest login");
    // 게스트 로그인 로직
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
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
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