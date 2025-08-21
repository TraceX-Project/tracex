import React from 'react';
// import router from '@/../public/router-svgrepo-com.svg'
import { Handle, Position } from '@xyflow/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Label } from '@radix-ui/react-label';

type interface_info = {
  name: string;
  ip: string;
  netmark: string;
  description: string;
};

type informations = {
  hostname: string;
  interface: [interface_info];
};

export const Routernode = ({ data }: { data: informations }) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="router-node flex flex-col items-center justify-center">
          {/* <Image src={router} alt='router-image' width={50} height={50} /> */}
          <Handle type="source" position={Position.Bottom} />
          <Handle type="target" position={Position.Top} />
          <p className="text-[10px]">{data.hostname}</p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="h-fit w-fit">
        <div className="flex flex-col gap-5">
          <Label>Device Name : {data.hostname}</Label>
          <Label>Device Model :</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Port</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>IPv6 Address</TableHead>
                <TableHead className="text-right">MAC Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.interface?.map((item: interface_info, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.ip}</TableCell>
                  <TableCell>{item.netmark}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
