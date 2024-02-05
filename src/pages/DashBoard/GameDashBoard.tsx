import { useEffect, useState } from "react";
import { userChangePasswordAPI, userByeAPI } from "@api/user";
import {ByeButton,ProfileHeader,ProfileChange, GameDashboardContainer, Button, Input, FormContainer } from "./styles";
import {Circle, BackgroundColor1, Span, BackgroundColor2, BackgroundColor3} from "../../BGstyles"

const GameDashboard = () => {
  const [activePath] = useState("/gamedashboard");
  const [nickname, setNickname] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = async () => {
    try {
      const data = await userChangePasswordAPI(nickname, oldPassword, newPassword);
      alert('비밀번호가 변경되었습니다.');
      console.log(data); // 데이터 처리
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다.');
      console.error(error);
    }
  };

  const handleUserBye = async () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      try {
        const data = await userByeAPI(nickname);
        alert('회원 탈퇴가 완료되었습니다.');
        console.log(data); // 데이터 처리
      } catch (error) {
        alert('회원 탈퇴에 실패했습니다.');
        console.error(error);
      }
    }
  };

return (
    <GameDashboardContainer>
      <ProfileHeader>비밀번호 변경</ProfileHeader>
      <ProfileChange>아래 내용을 전부 입력해주세요</ProfileChange>
      <FormContainer>
        <Input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
        />
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="기존 비밀번호 입력"
        />
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호 입력"
        />
        <Button
          onClick={handlePasswordChange}
          disabled={!nickname || !oldPassword || !newPassword} // 필드가 모두 채워져 있을 때만 버튼 활성화
        >
          비밀번호 변경
        </Button>
        <ByeButton onClick={handleUserBye}>회원 탈퇴</ByeButton>
      </FormContainer>
    </GameDashboardContainer>
  );
};

export default GameDashboard;
