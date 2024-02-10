import {
  SignupModalOverlay,
  SignupModalContainer,
  SignupCloseButton,
  SignupForm,
  SignupInput,
  SignupErrorMessage,
  SignupButton,
  SignupLabel,
  SignupText1,
  SignupText2,
  SignupText3,
  SignupText4,
  SignupText5,
} from "./styles";
import {
  validateNickname,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@util/validation";
import { signupAPI } from "@api/auth";
import { useState } from "react";

function SignupModal({ onClose }: { onClose: () => void }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameError(validateNickname(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(validateConfirmPassword(password, value));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signupAPI(nickname, email, password);
      alert(
        "회원가입이 성공적으로 완료되었습니다. 이메일로 인증 메일이 발송되었습니다.",
      );
      onClose();
    } catch (error) {
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <SignupModalOverlay>
      <SignupModalContainer>
        <SignupCloseButton onClick={onClose}>닫기</SignupCloseButton>
        <SignupText1>회원가입</SignupText1>
        <SignupForm onSubmit={handleSignup}>
          <SignupLabel>
            <SignupText2>닉네임</SignupText2>
            <SignupInput
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
            />
            <SignupErrorMessage>{nicknameError}</SignupErrorMessage>
          </SignupLabel>
          <SignupLabel>
            <SignupText3>이메일</SignupText3>
            <SignupInput
              type="text"
              value={email}
              onChange={handleEmailChange}
            />
            <SignupErrorMessage>{emailError}</SignupErrorMessage>
          </SignupLabel>
          <SignupLabel>
            <SignupText4>비밀번호</SignupText4>
            <SignupInput
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <SignupErrorMessage>{passwordError}</SignupErrorMessage>
          </SignupLabel>
          <SignupLabel>
            <SignupText5>비밀번호 확인</SignupText5>
            <SignupInput
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <SignupErrorMessage>{confirmPasswordError}</SignupErrorMessage>
          </SignupLabel>
          <SignupButton type="submit">회원가입</SignupButton>
        </SignupForm>
      </SignupModalContainer>
    </SignupModalOverlay>
  );
}
export default SignupModal;
