export interface HomepageState {
  nickname: string;
  email: string;
  isAuthenticated: boolean;
  error: null | string; // error can be a string or null
}
