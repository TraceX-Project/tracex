const ROOTS = {
  auth: '/v1/auth',
  users: '/v1/users',
};

export const ENDPOINTS = {
  proxyApi: `/api/proxy`,
  auth: {
    googleLoginLink: `${ROOTS.auth}/url`,
    googleLogin: `${ROOTS.auth}/login`,
    refresh: `${ROOTS.auth}/refresh`,
    logout: `${ROOTS.auth}/logout`,
  },
  users: {
    profile: `${ROOTS.users}/profile`,
  },
};
