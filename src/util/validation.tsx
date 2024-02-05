export const validateNickname = (nickname: string) => {
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,}$/;
  return nicknameRegex.test(nickname)
    ? ""
    : "닉네임은 한글, 영어, 숫자로 이루어진 2자리 이상이어야 합니다.";
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z.]+$/;
  return emailRegex.test(email) ? "" : "이메일 형식이 올바르지 않습니다.";
};

export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password)
    ? ""
    : "비밀번호는 영문+숫자 조합, 최소 8자 이상이어야 합니다.";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
) => {
  return password === confirmPassword ? "" : "비밀번호가 일치하지 않습니다.";
};
