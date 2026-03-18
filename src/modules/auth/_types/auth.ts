export type GetGoogleLoginUrlResponse = {
  url: string;
};

export type GoogleLoginRequest = {
  code: string;
  state: string;
  iss?: string;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};
