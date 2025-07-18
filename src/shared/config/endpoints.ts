const ROOTS = {
  auth: '/v1/auth',
  users: '/v1/users',
};

export const ENDPOINTS = {
  auth: {
    googleLoginLink: `${ROOTS.auth}/`,
    googleLogin: `${ROOTS.auth}/login`,
    refresh: `${ROOTS.auth}/refresh`,
    logout: `${ROOTS.auth}/logout`,
  },
  users: {
    profile: `${ROOTS.users}/profile`,
  },
};
