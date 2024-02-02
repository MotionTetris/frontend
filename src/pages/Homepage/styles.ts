import styled from "styled-components";

export const HomepageTitle = styled.h1`
  position: absolute;
  right: 4.7vw;
  bottom: 35vw;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  font-size: 42px;
  color: white;
  letter-spacing: 3px;
`;

export const HomepagesubTitle = styled.h1`
  position: absolute;
  bottom: 33vw;
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
  z-index: -1;
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
  top: 0;
  bottom: 0;
  right: 0;
`;

export const HomepageInnerContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0vw;
  width: 500px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
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
  position: absolute;
  font-family: "JalnanGothic", sans-serif;
  font-style: light;
  font-weight: 100;
  letter-spacing: 3px;

  bottom: 15vw;
  right: 2vw;
  background-color: #007bff;
`;

export const HomepageGuestLoginButton = styled(HomepageButton)`
  position: absolute;
  font-family: "JalnanGothic", sans-serif;
  font-style: light;
  font-weight: 100;
  letter-spacing: 3px;
  bottom: 11vw;
  right: 2vw;
  background-color: #6c757d;
`;

export const HomepageSignupButton = styled(HomepageButton)`
  position: absolute;
  font-family: "JalnanGothic", sans-serif;
  font-style: light;
  font-weight: 100;
  letter-spacing: 3px;
  bottom: 7vw;
  right: 2vw;
  background-color: #28a745;
`;
