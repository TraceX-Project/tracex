const ROOTS = {
  auth: '/v1/auth',
  users: '/v1/users',
  projects: '/v1/projects',
};

export const ENDPOINTS = {
  auth: {
    googleLoginLink: `${ROOTS.auth}`,
    googleLogin: `${ROOTS.auth}/login`,
    refresh: `${ROOTS.auth}/refresh`,
    logout: `${ROOTS.auth}/logout`,
  },
  users: {
    profile: `${ROOTS.users}/profile`,
  },
  projects: {
    create: `${ROOTS.projects}`,
    getAll: `${ROOTS.projects}`,
    getById: (id: string) => `${ROOTS.projects}/${id}`,
    update: (id: string) => `${ROOTS.projects}/${id}`,
    delete: (id: string) => `${ROOTS.projects}/${id}`,
  },
};
