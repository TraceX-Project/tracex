import React, { useCallback } from 'react';
import { type DeviceTemplateFormData, type PortRange, type PortType } from './_types/device-template';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { v4 as uuidv4 } from 'uuid';
import { DEVICE_PORT_TYPES_OPTIONS } from './_constants/device-template';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '@tanstack/react-form';
import { type FormType } from '@/shared/tanstack-form/form';
import { Label } from '@/shared/components/ui/label';

type Props = {
  form: FormType;
};

const LabelingPortConfiguration = ({ form }: Props) => {
  const portRanges = useStore(
    form.store,
    (state) => (state.values as DeviceTemplateFormData).portRanges ?? []
  );

  React.useEffect(() => {
    if (portRanges.length === 0) {
      const newPortRange: PortRange = {
        id: uuidv4(),
        portType: undefined as unknown as PortType,
        start: undefined as unknown as number,
        end: undefined as unknown as number,
        prefix: '',
        runningNumber: undefined as unknown as number,
      };
      form.setFieldValue('portRanges', [newPortRange]);
    }
  }, [])

  const addPortRange = useCallback(() => {
    const newPortRange: PortRange = {
      id: uuidv4(),
      portType: undefined as unknown as PortType,
      start: undefined as unknown as number,
      end: undefined as unknown as number,
      prefix: '',
      runningNumber: undefined as unknown as number,
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
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Label className="font-medium">Port Range Configuration</Label>
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
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
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
                      label="Running Number"
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

      {/* Add Port Range Button */}
      <Button
        type="button"
        onClick={addPortRange}
        className="bg-secondary text-muted-foreground hover:bg-secondary/90 hover:text-foreground w-full border border-dashed hover:border-solid"
      >
        <Plus className="h-4 w-4" />
        Add Port Range
      </Button>
    </div>
  );
};

export default LabelingPortConfiguration;
