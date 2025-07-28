const ROOTS = {
  auth: '/auth',
  admin: '/admin',
  projects: '/projects',
};

export const PATHS = {
  root: '/',
  terms: '/terms',
  privacy: '/privacy',
  login: '/login',
  projects: {
    root: `${ROOTS.projects}/`,
    detail: (id: string) => `${ROOTS.projects}/${id}`,
  },
  auth: {
    callback: `${ROOTS.auth}/callback`,
  },
  admin: {
    users: `${ROOTS.admin}/users`,
    devices: `${ROOTS.admin}/devices`,
  },
};
