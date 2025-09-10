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
  account: '/account',
  projects: {
    root: `${ROOTS.projects}`,
    new: `${ROOTS.projects}/new`,
    logical: (id: string) => `${ROOTS.projects}/${id}/logical`,
    physical: (id: string) => `${ROOTS.projects}/${id}/physical`,
    edit: (id: string) => `${ROOTS.projects}/${id}/edit`,
  },
  auth: {
    callback: `${ROOTS.auth}/callback`,
  },
  admin: {
    users: `${ROOTS.admin}/users`,
    deviceTemplates: {
      root: `${ROOTS.admin}/device-templates`,
      new: `${ROOTS.admin}/device-templates/new`,
      edit: (id: string) => `${ROOTS.admin}/device-templates/${id}/edit`,
    },
  },
};
