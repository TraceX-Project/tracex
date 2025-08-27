import { type DeviceType } from '@/modules/admin/device-templates/_types/device-template';
// import { DeviceTemplate } from "@/modules/admin/devices/_types/device";

export type DevicesResponse = {
  nodes: Node[];
  edges: Edge[];
};

export type Node = {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  type: DeviceType;
};

export type Edge = {
  source: string;
  target: string;
};

// export type Device = {
//     id: string
//     projectId: string
//     deviceTemplateId: string
//     name: string
//     x: number | null
//     y: number | null
//     deviceVLANs: DeviceVLAN[]
//     deviceInterfaces: DeviceInterface[]
//     deviceTemplate: DeviceTemplate
// }

// type DeviceVLAN = {
//     id: string;
//     deviceId: string;

//     vlanId: number;

//     vlanName: string;

//     interfaces: DeviceInterfaceVLAN[];

// }

// type DeviceInterfaceVLAN = {

//     id: string;

//     deviceInterfaceId: string;

//     deviceVlanId: string;

//     deviceInterface: DeviceInterface;

//     deviceVlan: DeviceVLAN;

// }

// type DeviceInterface = {

//     id: string;

//     deviceId: string;

//     interfaceName: string;

//     ipAddress: string | null;

//     description: string | null;

//     mode: "access" | "trunk" | null;

//     accessVlanId: string | null;

//     accessVlan: DeviceVLAN | null;

//     connectionsFrom: DeviceInterfaceConnection[];

//     connectionsTo: DeviceInterfaceConnection[];

//     vlan: DeviceInterfaceVLAN[];

// };

// type DeviceInterfaceConnection = {

//     id: string;

//     fromDeviceInterfaceId: string;

//     toDeviceInterfaceId: string;

//     fromDeviceInterface: DeviceInterface;

//     toDeviceInterface: DeviceInterface;

// };

// export type AddDeviceRequest = {

//     files: File[];

//     deviceTemplateId: string;

// };

// export type DeviceConfig = {

//     hostname: string;

//     interfaces: InterfaceConfig[];

//     vlans: VlanConfig[];

// }

// type InterfaceConfig = {

//     name: string;

//     ip: string;

//     description: string;

//     mode: string;

//     accessVlan: string;

//     allowedVlan: string[];

// }

// type VlanConfig = {

//     id: string;

//     name: string;

// }
