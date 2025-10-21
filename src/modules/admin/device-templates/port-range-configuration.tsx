// Replace your entire PortRangeConfiguration component with this:

import React, { useCallback } from 'react';
import { DeviceTemplateFormData, PortRange, PortType } from './_types/device-template';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { v4 as uuidv4 } from 'uuid';
import { DEVICE_PORT_TYPES_OPTIONS } from './_constants/device-template';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '@tanstack/react-form';
import { FormType } from '@/shared/tanstack-form/form';

type Props = {
  form: FormType;
};

const PortRangeConfiguration = ({ form }: Props) => {
  const portRanges = useStore(
    form.store,
    (state) => (state.values as DeviceTemplateFormData).portRanges || []
  );

  const addPortRange = useCallback(() => {
    const newPortRange: PortRange = {
      id: uuidv4(),
      portType: PortType.FAST_ETHERNET,
      start: 1,
      end: 1,
      prefix: '',
      runningNumber: 1,
    };

    form.setFieldValue('portRanges', [...portRanges, newPortRange]);
  }, [form, portRanges]);

  const removePortRange = useCallback(
    (id: string) => {
      const updatedPortRanges = portRanges.filter((pr) => pr.id !== id);
      form.setFieldValue('portRanges', updatedPortRanges);
    },
    [form, portRanges]
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-foreground text-xl font-semibold">Port Range Configuration</h3>
        <Button type="button" onClick={addPortRange} size="sm">
          <Plus className="h-4 w-4" />
          Add Port Range
        </Button>
      </div>

      {/* Port Range List */}
      <div className="space-y-4">
        {portRanges.map((portRange, index) => (
          <Card key={portRange.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Port Range {index + 1}</CardTitle>
                </div>

                <div className="flex gap-2">
                  {portRanges.length > 1 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={() => removePortRange(portRange.id)}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove this range</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Port Type */}
                <form.AppField
                  name={`portRanges[${index}].portType`}
                  children={(field) => (
                    <field.SelectField
                      label="Port Type"
                      options={DEVICE_PORT_TYPES_OPTIONS}
                      placeholder="Select port type"
                    />
                  )}
                />

                {/* Start */}
                <form.AppField
                  name={`portRanges[${index}].start`}
                  children={(field) => (
                    <field.NumberField
                      label="Start"
                      placeholder="Start"
                      min={1}
                      className="text-sm"
                    />
                  )}
                />

                {/* End */}
                <form.AppField
                  name={`portRanges[${index}].end`}
                  children={(field) => (
                    <field.NumberField label="End" placeholder="End" min={1} className="text-sm" />
                  )}
                />

                {/* Prefix */}
                <form.AppField
                  name={`portRanges[${index}].prefix`}
                  children={(field) => (
                    <field.TextField
                      label="Prefix"
                      placeholder="e.g., 1/0, 2/1, 3/"
                      className="text-sm"
                    />
                  )}
                />

                {/* Running Number */}
                <form.AppField
                  name={`portRanges[${index}].runningNumber`}
                  children={(field) => (
                    <field.NumberField
                      label="Starting Number"
                      placeholder="Starting from"
                      min={1}
                      className="text-sm"
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortRangeConfiguration;
