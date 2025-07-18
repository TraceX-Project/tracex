export type GetGoogleLoginUrlResponse = {
  url: string;
};

export type GoogleLoginRequest = {
  code: string;
  state: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};
