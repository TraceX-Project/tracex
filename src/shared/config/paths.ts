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
    root: `${ROOTS.projects}`,
    new: `${ROOTS.projects}/new`,
    detail: (id: string) => `${ROOTS.projects}/${id}`,
    edit: (id: string) => `${ROOTS.projects}/${id}/edit`,
  },
  auth: {
    callback: `${ROOTS.auth}/callback`,
  },
  admin: {
    users: `${ROOTS.admin}/users`,
    devices: {
      root: `${ROOTS.admin}/devices`,
      new: `${ROOTS.admin}/devices/new`,
    },
  },
};
