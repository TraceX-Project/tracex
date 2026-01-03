const ROOTS = {
  auth: '/auth',
  users: '/users',
  projects: '/projects',
  deviceTemplates: '/device-templates',
  ports: '/ports',
  buildings: '/buildings',
  floors: '/floors',
  logicalDevices: '/logical-devices',
  rooms: '/rooms',
  rooms: '/rooms',
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
    upload: (id: string) => `${ROOTS.projects}/${id}/upload`,
    topology: (id: string) => `${ROOTS.projects}/${id}/topology`,
    thumbnail: (id: string) => `${ROOTS.projects}/${id}/thumbnail`,
    logicalDevices: (id: string) => `${ROOTS.projects}/${id}/logical-devices`,
    createServer: (id: string) => `${ROOTS.projects}/${id}/servers`,
  },
  deviceTemplates: {
    create: `${ROOTS.deviceTemplates}`,
    getAll: `${ROOTS.deviceTemplates}`,
    getById: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
    update: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
    delete: (id: string) => `${ROOTS.deviceTemplates}/${id}`,
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
  logicalDevices: {
    delete: (id: string) => `${ROOTS.logicalDevices}/${id}`,
    getById: (id: string) => `${ROOTS.logicalDevices}/${id}`,
  },
  rooms: {
    deleteById: (id: string) => `${ROOTS.rooms}/${id}`,
    update: (id: string) => `${ROOTS.rooms}/${id}`,
    getRacks: (roomId: string) => `${ROOTS.rooms}/${roomId}/racks`,
  },
};

export const PROTON_API_URL = 'https://photon.komoot.io'