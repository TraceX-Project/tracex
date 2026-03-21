'use client';

import React, { useMemo } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { useGetDeviceTemplates } from '../admin/device-templates/_hooks/use-get-device-templates';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { HypervisorNode } from './_types/logical-view';
import DevicePortSelector from './device-port-selector';
import { FormType } from '@/shared/tanstack-form/form';
import { useStore } from '@tanstack/react-form';

type NodeConfig = {
  name: string;
  deviceTemplateId: string;
  connectPortIds: string[];
};

type Props = {
  form: FormType;
  deviceId: string;
  hypervisorNodes: HypervisorNode[];
};

const NodesStep = ({ form, deviceId, hypervisorNodes }: Props) => {
  const { data: deviceTemplates } = useGetDeviceTemplates({ type: [DeviceType.SERVER] });

  const deviceTemplateOptions = useMemo(
    () => deviceTemplates?.map((t) => ({ label: t.modelName, value: t.id })) ?? [],
    [deviceTemplates]
  );

  const nodeConfigs = useStore(
    form.store,
    (state) => (state.values as { nodes: NodeConfig[] }).nodes ?? []
  );

  return (
    <div className="max-h-[400px] space-y-6 overflow-y-auto pr-1">
      {nodeConfigs.map((nodeConfig, index) => (
        <div key={nodeConfig.name} className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{nodeConfig.name}</Badge>
            <span className="text-muted-foreground text-xs">{hypervisorNodes[index]?.status}</span>
          </div>

          <form.AppField
            name={`nodes[${index}].deviceTemplateId` as never}
            children={(field) => (
              <field.SelectField
                label="Device Template"
                options={deviceTemplateOptions}
                placeholder="Select a device template"
              />
            )}
          />

          <form.AppField
            name={`nodes[${index}].connectPortIds` as never}
            children={(field) => (
              <DevicePortSelector
                value={(field.state.value as string[]) ?? []}
                onChange={field.handleChange as (ids: string[]) => void}
                initDeviceId={deviceId}
                initServerConections={[]}
                usedPortIds={nodeConfigs.flatMap((n, i) => (i !== index ? n.connectPortIds : []))}
                errors={(field.state.meta.errors as unknown as { message?: string }[]).map(
                  (e) => e?.message ?? ''
                )}
              />
            )}
          />

          {index < nodeConfigs.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};

export default NodesStep;
