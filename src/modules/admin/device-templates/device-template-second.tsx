import React from 'react'
import { DEVICE_PORT_ALIGNMENT_OPTIONS } from './_constants/device-template'
import { useUploadFile } from '@/shared/hooks/use-upload-file';


type DeviceTemplateStepperProps = {
  form: any;
};

export const DeviceTemplateSecond = ({ form }: DeviceTemplateStepperProps) => {
  const { onUpload: onUploadFront } = useUploadFile();
  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Front Panel Upload */}
      <form.AppField
        name="frontPanelUrl"
        children={(field:any) => (
          <field.FileUploader label="Front Panel" maxFiles={1} onUpload={onUploadFront} />
        )}
      />
      
      {/* Group: Unit Size, Vendor, Type */}
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
        {/* port alignment */}
        <div>
          <form.AppField
            name="alignment"
            children={(field:any) => (
              <field.SelectField
                label="Port Alignment"
                options={DEVICE_PORT_ALIGNMENT_OPTIONS}
                placeholder="Select a port alignment"
              />
            )}
          />
        </div>
      </div>
    </form>
  )
}
