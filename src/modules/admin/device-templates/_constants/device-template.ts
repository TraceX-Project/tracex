import { Vendor, DeviceType } from '../_types/device-template';

export const DEVICE_VENDORS_OPTIONS = [
  { value: Vendor.CISCO, label: 'Cisco' },
  { value: Vendor.DELL, label: 'Dell' },
  { value: Vendor.MIKROTIK, label: 'Mikrotik' },
];

export const DEVICE_PORT_ALIGNMENT_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
];

export const DEVICE_TYPES_OPTIONS = [
  { value: DeviceType.ROUTER, label: 'Router' },
  { value: DeviceType.SWITCH, label: 'Switch' },
];

export const DEVICE_ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];

export const DEVICE_MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
