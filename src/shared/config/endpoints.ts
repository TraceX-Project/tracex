const ROOTS = {
  auth: '/v1/auth',
  users: '/v1/users',
  projects: '/v1/projects',
  deviceTemplates: '/v1/device-templates',
  attachments: '/v1/attachments',
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
  deviceTemplates: {
    create: `${ROOTS.deviceTemplates}`,
    getAll: `${ROOTS.deviceTemplates}`,
    getById: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
    update: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
    delete: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
  },
  attachments: {
    upload: `${ROOTS.attachments}/upload`,
    delete: (id: string) => `${ROOTS.attachments}/${id}`,
  },
};
