import React, { useEffect } from 'react'
import { useCreatePorts } from './_hooks/use-create-ports';
import { useGetPorts } from './_hooks/use-get-ports';


type DeviceTemplateStepperProps = {
  form: any;
};

export const DeviceTemplateSecond = ({ form }: DeviceTemplateStepperProps) => {
  const { mutateAsync: createPorts } = useCreatePorts();
  const [taskId, setTaskId] = React.useState<string>('');

  const { data: ports, isLoading } = useGetPorts(taskId);

  const handleUpload = async (files: File[]) => {
    const result = await createPorts(files);
    if (result?.taskId) {
      setTaskId(result.taskId);
      console.log("File",files[0])
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
        children={(field:any) => (
          <field.FileField label="Front Panel" onUpload={handleUpload} />
        )}
      />
      
      {/* Group: Rows, Cols */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <form.AppField
            name="rows"
            children={(field:any) => (
              <field.NumberField label="Rows" placeholder="Enter number of rows" />
            )}
          />
        </div>

        <div>
          <form.AppField
            name="columns"
            children={(field:any) => (
              <field.NumberField label="Columns" placeholder="Enter number of columns" />
            )}
          />
        </div>     
      </div>
    </div>
  )
}

