import { ENDPOINTS } from '@/shared/config/endpoints';

import { request } from '@/shared/lib/api';

// import { AddDeviceRequest, Device, DeviceConfig } from "../_types/logical-view";
import { type DevicesResponse } from '../_types/logical-view';

// export const addDevice = async (projectId: string, payload: AddDeviceRequest) => {

//     const response = await request<DeviceConfig[]>({

//         method: 'POST',

//         path: ENDPOINTS.devices.addDevice(projectId),

//         body: payload

//     });

//     return response.data;

// };

export const getDevicesInProject = async (projectId: string) => {
  const response = await request<DevicesResponse>({
    method: 'GET',
    path: ENDPOINTS.devices.getDevicesInProject(projectId),
  });
  return response.data;
};
