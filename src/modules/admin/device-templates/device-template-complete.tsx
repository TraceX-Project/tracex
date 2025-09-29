import React from 'react'
import { DEVICE_PORT_ALIGNMENT_OPTIONS } from './_constants/device-template'
import type { AppFieldExtendedReactFormApi } from '@/shared/types/forms';

type DeviceTemplateStepperProps = {
    form: AppFieldExtendedReactFormApi;
};
export const DeviceTemplateComplete = ({form}:DeviceTemplateStepperProps) => {
  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
          {/* Front Panel Upload */}
          <img src="/images/device-template/front-panel.png" alt="Front Panel" width={600} height={400} className="mx-auto"/>
          
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
