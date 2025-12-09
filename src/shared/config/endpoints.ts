const ROOTS = {
  auth: '/auth',
  users: '/users',
  projects: '/projects',
  deviceTemplates: '/device-templates',
  ports: '/ports',
  buildings: '/buildings',
  floors: '/floors',
};

export const ENDPOINTS = {
  auth: {
    googleLoginLink: `${ROOTS.auth}/google/url`,
    googleLogin: `${ROOTS.auth}/google/login`,
    refresh: `${ROOTS.auth}/refresh`,
    logout: `${ROOTS.auth}/logout`,
  },
  users: {
    getAll: `${ROOTS.users}`,
    profile: `${ROOTS.users}/profile`,
    updateRole: (userId: string) => `${ROOTS.users}/${userId}/role`,
  },
  projects: {
    create: `${ROOTS.projects}`,
    getAll: `${ROOTS.projects}`,
    getById: (id: string) => `${ROOTS.projects}/${id}`,
    update: (id: string) => `${ROOTS.projects}/${id}`,
    delete: (id: string) => `${ROOTS.projects}/${id}`,
    createBuilding: (id: string) => `${ROOTS.projects}/${id}/buildings`,
    getBuildings: (id: string) => `${ROOTS.projects}/${id}/buildings`,
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
    predict: `${ROOTS.ports}/predict`,
    result: (taskId: string) => `${ROOTS.ports}/result/${taskId}`,
  },
  buildings: {
    createFloor: (buildingId: string) => `${ROOTS.buildings}/${buildingId}/floors`,
    getById: (id: string) => `${ROOTS.buildings}/${id}`,
    reorderFloors: (buildingId: string) => `${ROOTS.buildings}/${buildingId}/floors/reorder`,
    getFloors: (buildingId: string) => `${ROOTS.buildings}/${buildingId}/floors`,
    delete: (id: string) => `${ROOTS.buildings}/${id}`,
    update: (id: string) => `${ROOTS.buildings}/${id}`,
  },
  floors: {
    getById: (id: string) => `${ROOTS.floors}/${id}`,
    createRoom: (floorId: string) => `${ROOTS.floors}/${floorId}/rooms`,
    getRooms: (floorId: string) => `${ROOTS.floors}/${floorId}/rooms`,
  },
};
