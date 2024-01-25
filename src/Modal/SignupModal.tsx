import { useSelector, useDispatch } from 'react-redux';
import { SignupModalOverlay, SignupModalContainer, SignupCloseButton, SignupForm, SignupInput, SignupErrorMessage, SignupButton } from '../Styled';
import { setNickname, setEmail, setPassword, setConfirmPassword, setNicknameError, setEmailError, setPasswordError, setConfirmPasswordError } from '../features/hompage/signupSlice'; // 경로는 실제 구조에 맞게 조정하세요.
import { RootState } from '../app/store';
import axios from 'axios';


function SignupModal({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const { nickname, email, password, confirmPassword, nicknameError, emailError, passwordError, confirmPasswordError } = useSelector((state:RootState) => state.signup);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setNickname(value));
    // 닉네임 유효성 검사: 한글, 영어, 숫자만 허용, 최소 2자 이상
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,}$/;
    const isValid = nicknameRegex.test(value);
    dispatch(setNicknameError(isValid ? '' : '닉네임은 한글, 영어, 숫자로 이루어진 2자리 이상이어야 합니다.')); // 에러 메시지 설정
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setEmail(value));
    // 이메일 유효성 검사
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z.]+$/;
    const isValid = emailRegex.test(value);
    dispatch(setEmailError(isValid ? '' : '이메일 형식이 올바르지 않습니다.')); // 에러 메시지 설정
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setPassword(value));
    // 비밀번호 유효성 검사: 영문+숫자 조합, 최소 8자 이상
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isValid = passwordRegex.test(value);
    dispatch(setPasswordError(isValid ? '' : '비밀번호는 영문+숫자 조합, 최소 8자 이상이어야 합니다.')); // 에러 메시지 설정
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setConfirmPassword(value));
    dispatch(setConfirmPasswordError(password === value ? '' : '비밀번호가 일치하지 않습니다.'));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 회원가입 로직 처리
    try {
      const response = await axios.post('/api/signup', {
        nickname: nickname,
        email: email,
        password: password
      });
  
      if (response.status === 200) {
        console.log('Signup successful:', response.data);
        // 회원가입 성공 후의 로직을 여기에 작성할 수 있습니다.
      } else {
        console.error('Signup failed:', response.data);
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <SignupModalOverlay>
      <SignupModalContainer>
        <SignupCloseButton onClick={onClose}>닫기</SignupCloseButton>
        <h2>회원가입</h2>
        <SignupForm onSubmit={handleSignup}>
          <label>
            닉네임:
            <br></br>
            <SignupInput type="text" value={nickname} onChange={handleNicknameChange} />
            <SignupErrorMessage>{nicknameError}</SignupErrorMessage>  
          </label>
          <label>
            이메일:
            <br></br>
            <SignupInput type="text" value={email} onChange={handleEmailChange} />
            <SignupErrorMessage>{emailError}</SignupErrorMessage>  
          </label>
          <label>
            비밀번호:
            <br></br>
            <SignupInput type="password" value={password} onChange={handlePasswordChange} />
            <SignupErrorMessage>{passwordError}</SignupErrorMessage>  
          </label>
          <label>
            비밀번호확인:
            <br></br>
            <SignupInput type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            <SignupErrorMessage>{confirmPasswordError}</SignupErrorMessage>  
          </label>
          <SignupButton type="submit">회원가입</SignupButton>
        </SignupForm>
      </SignupModalContainer>
    </SignupModalOverlay>
  );
}

export default SignupModal;
