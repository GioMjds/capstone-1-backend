export interface IAuthLoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
  access_token: string;
}

export interface IRegisterUserResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
}

export interface IGetUserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}
