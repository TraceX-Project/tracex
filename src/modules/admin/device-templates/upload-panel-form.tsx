import React, { useEffect } from 'react';
import { useCreatePorts } from './_hooks/use-create-ports';
import { useGetPorts } from './_hooks/use-get-ports';
import { useAppForm } from '@/shared/tanstack-form/form';
import { Label } from '@/shared/components/ui/label';

type Props = {
  form: ReturnType<typeof useAppForm>;
};

const UploadPanelForm = ({ form }: Props) => {
  const { mutateAsync: createPorts } = useCreatePorts();
  const [taskId, setTaskId] = React.useState<string>('');

  const { data: ports, isLoading } = useGetPorts(taskId);

  const handleUpload = async (files: File[]) => {
    const result = await createPorts(files);
    if (result?.taskId) {
      setTaskId(result.taskId);
      form.setFieldValue('frontPanel', files[0]);
    }
  };

  useEffect(() => {
    if (!isLoading && ports) {
      form.setFieldValue('ports', ports.ports);
    }
  }, [isLoading, ports, form]);

  return (
    <div className="space-y-6">
      {/* Front Panel Upload */}
      <form.AppField
        name="frontPanel"
        children={(field) => <field.FileField label="Front Panel" onUpload={handleUpload} />}
      />

      {/* Row, Column */}
      <div className="font-medium">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Label className="text-sm font-semibold">Port Layout:</Label>
          <div className="flex gap-4">
            <Label className="text-sm font-medium">Row</Label>
            <form.AppField
              name="rows"
              children={(field) => (
                <field.NumberField className="w-20" placeholder="Enter number of rows" />
              )}
            />
          </div>

          <div className="flex gap-4">
            <Label className="text-sm font-medium">Column</Label>
            <form.AppField
              name="columns"
              children={(field) => (
                <field.NumberField className="w-20" placeholder="Enter number of columns" />
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
