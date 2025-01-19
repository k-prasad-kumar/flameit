export interface RegisterInterface {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface SocialLoginInterface {
  name: string;
  email: string;
  profilePicture: string;
}
