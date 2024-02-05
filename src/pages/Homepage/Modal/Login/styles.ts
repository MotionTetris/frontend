import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

type AnimatedSectionProps = {
  $fadein: boolean;  // 수정된 부분
};

const AnimatedSection = styled.section<AnimatedSectionProps>`
  animation: ${(props) => (props.$fadein ? fadeIn : fadeOut)} 300ms forwards; // 수정된 부분
`;

export { AnimatedSection /* ...other exports... */ };

export const HomepageTitle = styled.h1`
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  position: relative;
  left: 1vw;
  bottom: 10vw;
  font-size: 42px;
  color: white;
  letter-spacing: 3px;
`;

export const HomepagesubTitle = styled.h1`
  position: relative;
  right: 0vw;
  bottom: 10vw;
  font-size: 20px;
  color: white;
  font-family: "JalnanGothic", sans-serif;
  letter-spacing: 1px;
  font-weight: 100;
`;

export const HomepageBackgroundVideo = styled.video`
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
`;

export const EmailInputString = styled.label`
  position: absolute;
  top: 18vw;
  right: 3vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
`;

export const Icon = styled.div`
  color: gray;
  position: absolute;
  top: 58%;
  scale: 1.3;
  transform: translateY(-50%);
  left: 17px;
`;

export const EmailInputField = styled.input`
  position: relative;
  width: 340px;
  height: 40px;
  font-size: 16px;
  padding-left: 40px;
  border-radius: 20px;
  border-radius: 66px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  transition: box-shadow 0.3s ease;

  &:hover,
  &:focus {
    box-shadow: 0 0 10px #dcd6f7;
  }
  &::placeholder {
    position: relative;
    font-size: 16px;
    top: 2px;
    color: rgba(128, 128, 128, 0.6);
    font-family: "JalnanGothic", sans-serif;
  }
`;

export const PasswordInputString = styled.label`
  position: absolute;
  top: 23vw;
  right: 3vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
`;

export const PasswordInputField = styled.input`
  position: relative;
  width: 340px;
  height: 40px;
  font-size: 16px;
  padding-left: 40px;
  border-radius: 66px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);

  transition: box-shadow 0.3s ease;
  &:hover,
  &:focus {
    box-shadow: 0 0 10px #dcd6f7;
  }
  &::placeholder {
    position: relative;
    font-size: 16px;
    top: 2px;
    color: rgba(128, 128, 128, 0.6);
    font-family: "JalnanGothic", sans-serif;
  }
`;

export const HomepageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const HomepageDiv = styled.div`
  position: absolute;
  width: 500px;
  height: 100%;
  bottom: 0vw;
  right: 0vw;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;
export const HomepageInnerContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0vw;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HomepageButton = styled.button`
  position: relative;
  left: 5.8vw;
  padding: 10px 20px;
  font-size: 18px;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 60%;
  margin: 10px 0;
  transition: all 0.3s; // 모든 CSS 속성에 대해 0.3초의 트랜지션 효과 적용
  &:hover,
  &:focus {
    box-shadow: 0 0 10px #dcd6f7;
    transform: scale(1.1); // scale을 transform 속성 내부에 지정
  }
`;

export const HomepageLoginButton = styled(HomepageButton)`
  position: relative;
  left: 1vw;
  top: 5vw;
  width: 330px;
  font-family: "JalnanGothic", sans-serif;
  font-style: light;
  font-weight: 100;
  letter-spacing: 3px;
  bottom: 15vw;
  right: 2vw;
  background-color: #007bff;
`;

export const HomepageGuestLoginButton = styled(HomepageButton)`
  position: relative;
  left: 1vw;
  top: 6vw;
  width: 330px;
  font-family: "JalnanGothic", sans-serif;
  font-style: light;
  font-weight: 100;
  letter-spacing: 3px;
  bottom: 11vw;
  right: 2vw;
  background-color: #6c757d;
`;

export const HomepageSignupButton = styled(HomepageButton)`
  position: relative;
  left: 1vw;
  top: 7vw;
  width: 330px;
  font-family: "JalnanGothic", sans-serif;
  font-style: light;
  font-weight: 100;
  letter-spacing: 3px;
  bottom: 7vw;
  right: 2vw;
  background-color: #28a745;
`;
