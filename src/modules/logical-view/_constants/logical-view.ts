import { DeviceType } from '@/modules/admin/device-templates/_types/device-template';
import RouterNode from '../router-node';
import SwitchNode from '../switch-node';

export const NODE_TYPES = {
  [`${DeviceType.ROUTER}`]: RouterNode,
  [`${DeviceType.SWITCH}`]: SwitchNode,
};

export const DEFAULT_NODE_WIDTH = 172;
export const DEFAULT_NODE_HEIGHT = 36;
