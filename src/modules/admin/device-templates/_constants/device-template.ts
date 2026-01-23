import { Vendor, DeviceType, PortType } from '../_types/device-template';

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
  { value: DeviceType.SERVER, label: 'Server' },
];

export const DEVICE_PORT_TYPES_OPTIONS = [
  { value: PortType.FAST_ETHERNET, label: 'FastEthernet' },
  { value: PortType.GIGABIT_ETHERNET, label: 'GigabitEthernet' },
  { value: PortType.TEN_GIGABIT_ETHERNET, label: 'TenGigabitEthernet' },
];

export const DEVICE_ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];

export const DEVICE_MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const DEFAULT_DEVICE_TEMPLATE_PORT_RANGE = {
  portType: PortType.FAST_ETHERNET,
  start: 1,
  end: 2,
  prefix: '',
  runningNumber: 1,
};
