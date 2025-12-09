import React from 'react';
import { type useAppForm } from '@/shared/tanstack-form/form';
import { Label } from '@/shared/components/ui/label';
import { usePortBoundingBoxStore } from './_store/port-boundingbox';

type Props = {
  form: ReturnType<typeof useAppForm>;
};

const UploadPanelForm = ({ form }: Props) => {
  const { setBoxes } = usePortBoundingBoxStore((state) => state.actions);

  const handleFrontPanelChange = () => {
    setBoxes([]);
    form.setFieldValue('boundingBoxes', []);
  };

  return (
    <div className="space-y-6">
      {/* Front Panel Upload */}
      <form.AppField
        name="frontPanel"
        children={(field) => (
          <field.FileField onValueChange={handleFrontPanelChange} label="Front Panel" />
        )}
      />

      {/* Row, Column */}
      <div className="font-medium">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Label className="text-sm font-semibold">Port Layout:</Label>
          <div className="flex gap-4">
            <form.AppField
              name="rows"
              children={(field) => (
                <field.NumberField
                  label="Row"
                  orientation="horizontal"
                  className="w-20"
                  placeholder="Enter number of rows"
                />
              )}
            />
          </div>

          <div className="flex gap-4">
            <form.AppField
              name="columns"
              children={(field) => (
                <field.NumberField
                  label="Column"
                  orientation="horizontal"
                  className="w-20"
                  placeholder="Enter number of columns"
                />
              )}
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-xs font-normal italic">
          e.g. 2 rows, 24 columns for standard 48 ports switch.
        </p>
      </div>
    </div>
  );
};

export default UploadPanelForm;
