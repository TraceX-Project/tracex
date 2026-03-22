import { DeviceType } from '@/modules/admin/device-templates/_types/device-template';
import RouterNode from '../router-node';
import SwitchNode from '../switch-node';
import StackSwitchNode from '../stack-switch-node';
import { HypervisorVendor } from '../_types/logical-view';
import ServerNode from '../server-node';
import VMNode from '../vm-node';
import VSwitchNode from '../vswitch-node';

export const NODE_TYPES = {
  [`${DeviceType.ROUTER}`]: RouterNode,
  [`${DeviceType.SWITCH}`]: SwitchNode,
  [`${DeviceType.SWITCH_STACK}`]: StackSwitchNode,
  [`${DeviceType.SERVER}`]: ServerNode,
  [`${DeviceType.VIRTUAL_MACHINE}`]: VMNode,
  [`${DeviceType.VIRTUAL_SWITCH}`]: VSwitchNode,
};

export const DEFAULT_NODE_WIDTH = 172;
export const DEFAULT_NODE_HEIGHT = 36;

export const HYPERVISOR_VENDORS_OPTIONS = [
  { value: HypervisorVendor.ESXI, label: 'EXSI' },
  { value: HypervisorVendor.PROXMOX, label: 'PROXMOX' },
];
