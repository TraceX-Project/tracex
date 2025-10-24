const ROOTS = {
  auth: '/auth',
  users: '/users',
  projects: '/projects',
  deviceTemplates: '/device-templates',
  ports: '/ports',
};

export const ENDPOINTS = {
  auth: {
    googleLoginLink: `${ROOTS.auth}/google/url`,
    googleLogin: `${ROOTS.auth}/google/login`,
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
    createBuilding: (id: string) => `${ROOTS.projects}/${id}/buildings`,
  },
  deviceTemplates: {
    create: `${ROOTS.deviceTemplates}`,
    getAll: `${ROOTS.deviceTemplates}`,
    getById: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
    update: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
    delete: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
  },
  devices: {
    addDevice: (id: string) => `${ROOTS.projects}/${id}/devices`,
    getDevicesInProject: (id: string) => `${ROOTS.projects}/${id}/devices`,
  },
  ports: {
    createPorts: `${ROOTS.ports}/predict`,
    getPortsInDevice: (taskId: string) => `${ROOTS.ports}/result/${taskId}`,
  },
};
