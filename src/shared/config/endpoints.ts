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
  racks: '/racks',
  servers: '/servers',
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
    physicalDevices: (projectId: string) => `${ROOTS.projects}/${projectId}/physical-devices`,
    logicalDevices: (id: string) => `${ROOTS.projects}/${id}/logical-devices`,
    createServer: (id: string) => `${ROOTS.projects}/${id}/servers`,
    generateDocument: (id: string) => `${ROOTS.projects}/${id}/document`,
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
    delete: (id: string) => `${ROOTS.floors}/${id}`,
    update: (id: string) => `${ROOTS.floors}/${id}`,
  },
  logicalDevices: {
    delete: (id: string) => `${ROOTS.logicalDevices}/${id}`,
    getById: (id: string) => `${ROOTS.logicalDevices}/${id}`,
    updatePositions: `${ROOTS.logicalDevices}/positions`,
  },
  rooms: {
    deleteById: (id: string) => `${ROOTS.rooms}/${id}`,
    update: (id: string) => `${ROOTS.rooms}/${id}`,
    getById: (id: string) => `${ROOTS.rooms}/${id}`,
    getRacks: (roomId: string) => `${ROOTS.rooms}/${roomId}/racks`,
    createRack: (roomId: string) => `${ROOTS.rooms}/${roomId}/racks`,
    reorderRacks: (roomId: string) => `${ROOTS.rooms}/${roomId}/racks/reorder`,
  },
  racks: {
    addDeviceToRack: (rackId: string) => `${ROOTS.racks}/${rackId}/devices`,
    getDevicesByRackId: (rackId: string) => `${ROOTS.racks}/${rackId}/devices`,
    updateRack: (rackId: string) => `${ROOTS.racks}/${rackId}`,
    delete: (rackId: string) => `${ROOTS.racks}/${rackId}`,
    removeDeviceFromRack: (rackId: string, deviceId: string) =>
      `${ROOTS.racks}/${rackId}/devices/${deviceId}`,
  },
  servers: {
    syncVms: (serverId: string) => `${ROOTS.servers}/${serverId}/sync-vms`,
  },
};

export const PROTON_API_URL = 'https://photon.komoot.io';
