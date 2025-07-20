const ROOTS = {
  auth: '/auth',
  admin: '/admin',
};

export const PATHS = {
  root: '/',
  terms: '/terms',
  privacy: '/privacy',
  login: '/login',
  projects: '/projects',
  auth: {
    callback: `${ROOTS.auth}/callback`,
  },
  admin: {
    users: `${ROOTS.admin}/users`,
    devices: `${ROOTS.admin}/devices`,
  },
};
