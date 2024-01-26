// SignupModal의 스타일링
import styled from 'styled-components';

export const SignupModalOverlay = styled.div`
  position: fixed;
  top: 3vw;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const SignupModalContainer = styled.div`
  position: relative;
  width: 500px;
  height: 100%;
  scrollbar-width: none; // 스크롤바 숨기기
`;

export const SignupCloseButton = styled.button`
  position: absolute;
  left: 22vw;
  bottom: 87vh;
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  font-size: 18px;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 20%;
  margin: 10px 0;
  transition: all 0.3s;
  background-color: #28a745;
  scale: 0.8;
  &:hover, &:focus {
    box-shadow: 0 0 10px #dcd6f7;
    transform: scale(1.1);
  }

`;

export const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SignupLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
`;

export const SignupInput = styled.input`
  width: 340px;
  height: 40px;
  font-size: 16px;
  padding-left: 40px;
  border-radius: 66px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  transition: box-shadow 0.3s ease;

  &:hover, &:focus {
    box-shadow: 0 0 10px #dcd6f7;
  }

  &::placeholder {
    position: relative;
    font-size: 16px;
    top: 2px;
    color: rgba(128, 128, 128, 0.6);
    font-family: 'JalnanGothic', sans-serif;
  }
`;

export const SignupButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  font-size: 18px;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 60%;
  margin: 10px 0;
  transition: all 0.3s;
  background-color: #28a745;

  &:hover, &:focus {
    box-shadow: 0 0 10px #dcd6f7;
    transform: scale(1.1);
  }
`;

export const SignupErrorMessage = styled.div`
  color: red;
`;

export const SignupText1 = styled.h1`
  position: relative;
  left: 8vw;
  bottom: 0vw;
  font-family: 'DNFBitBitv2', sans-serif;
  font-style:light;
  font-weight:100;
  font-size :53px;
  color: white;
  letter-spacing: 3px;
`;

export const SignupText2 = styled.h2`
  font-size :20px;
  color: white;
  font-family: 'JalnanGothic', sans-serif;
  letter-spacing: 1px;
  font-weight:100;
`;

export const SignupText3 = styled.h2`
  font-size :20px;
  color: white;
  font-family: 'JalnanGothic', sans-serif;
  letter-spacing: 1px;
  font-weight:100;
`;
export const SignupText4 = styled.h2`
  font-size :20px;
  color: white;
  font-family: 'JalnanGothic', sans-serif;
  letter-spacing: 1px;
  font-weight:100;
`;

export const SignupText5 = styled.h2`
  font-size :20px;
  color: white;
  font-family: 'JalnanGothic', sans-serif;
  letter-spacing: 1px;
  font-weight:100;
`;
// SignupText3, SignupText4, SignupText5는 위와 같이 변경하시면 됩니다.
