import { useSelector, useDispatch } from 'react-redux';
import { SignupModalOverlay, SignupModalContainer, SignupCloseButton, SignupForm, SignupInput, SignupErrorMessage, SignupButton, SignupLabel, SignupText1,SignupText2, SignupText3, SignupText4, SignupText5 } from './styles';
import { setNickname, setEmail, setPassword, setConfirmPassword, setNicknameError, setEmailError, setPasswordError, setConfirmPasswordError } from '@features/hompage/signupSlice'; // 경로는 실제 구조에 맞게 조정하세요.
import { RootState } from '@app/store';
import { validateNickname, validateEmail, validatePassword, validateConfirmPassword } from '@util/validation';
import { signupAPI } from '@api/auth';

function SignupModal({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const { nickname, email, password, confirmPassword, nicknameError, emailError, passwordError, confirmPasswordError } = useSelector((state:RootState) => state.signup);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setNickname(value));
    dispatch(setNicknameError(validateNickname(value)));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setEmail(value));
    dispatch(setEmailError(validateEmail(value)));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setPassword(value));
    dispatch(setPasswordError(validatePassword(value)));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setConfirmPassword(value));
    dispatch(setConfirmPasswordError(validateConfirmPassword(password, value)));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signupAPI(nickname, email, password);
      if (response.status === 200) {
        console.log('Signup successful:', response.data);
        alert('회원가입이 성공적으로 완료되었습니다.');
        onClose();
      } else {
        console.error('Signup failed:', response.data);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <SignupModalOverlay>
      <SignupModalContainer>
        <SignupCloseButton onClick={onClose}>닫기</SignupCloseButton>
        <SignupText1>회원가입</SignupText1>
        <SignupForm onSubmit={handleSignup}>
          <SignupLabel>
          <SignupText2>닉네임:</SignupText2>
            <SignupInput type="text" value={nickname} onChange={handleNicknameChange} />
            <SignupErrorMessage>{nicknameError}</SignupErrorMessage>  
          </SignupLabel>
          <SignupLabel>
          <SignupText3>이메일:</SignupText3>
            <SignupInput type="text" value={email} onChange={handleEmailChange} />
            <SignupErrorMessage>{emailError}</SignupErrorMessage>  
          </SignupLabel>
          <SignupLabel>
          <SignupText4>비밀번호:</SignupText4>
            <SignupInput type="password" value={password} onChange={handlePasswordChange} />
            <SignupErrorMessage>{passwordError}</SignupErrorMessage>  
          </SignupLabel>
          <SignupLabel>
          <SignupText5>비밀번호 확인:</SignupText5>
            <SignupInput type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            <SignupErrorMessage>{confirmPasswordError}</SignupErrorMessage>  
          </SignupLabel>
          <SignupButton type="submit">회원가입</SignupButton>
        </SignupForm>
      </SignupModalContainer>
    </SignupModalOverlay>
  );
}

export default SignupModal;
