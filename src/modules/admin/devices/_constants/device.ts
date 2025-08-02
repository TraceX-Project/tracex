export enum DeviceBrand {
  CISCO = 'cisco',
  DELL = 'dell',
  MIKROTIK = 'mikrotik',
}

export enum DeviceType {
  ROUTER = 'router',
  SWITCH = 'switch',
}

export const DEVICE_BRANDS_OPTIONS = [
  { value: DeviceBrand.CISCO, label: 'Cisco' },
  { value: DeviceBrand.DELL, label: 'Dell' },
  { value: DeviceBrand.MIKROTIK, label: 'Mikrotik' },
];

export const DEVICE_TYPES_OPTIONS = [
  { value: DeviceType.ROUTER, label: 'Router' },
  { value: DeviceType.SWITCH, label: 'Switch' },
];

export const DEVICE_ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];

export const DEVICE_MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
