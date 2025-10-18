import React from 'react'
import { DEVICE_VENDORS_OPTIONS, DEVICE_TYPES_OPTIONS } from './_constants/device-template'

type DeviceTemplateStepperProps = {
    form: any;
};

export const DeviceTemplateFirst = ({ form }: DeviceTemplateStepperProps) => {
    return (
        <div className="space-y-6">
            {/* Vendor */}
            <div>
                <form.AppField
                    name="vendor"
                    children={(field: any) => (
                        <field.SelectField
                            label="Vendor"
                            options={DEVICE_VENDORS_OPTIONS}
                            placeholder="Select a vendor"
                        />
                    )}
                />
            </div>
            {/* Model Name */}
            <div>
                <form.AppField
                    name="modelName"
                    children={(field:any) => (
                        <field.TextField label="Model Name" placeholder="Enter model name" />
                    )}
                />
            </div>
              {/* Type */}
            <div>
                <form.AppField
                    name="deviceType"
                    children={(field:any) => (
                        <field.SelectField
                            label="Type"
                            options={DEVICE_TYPES_OPTIONS}
                            placeholder="Select a type"
                        />
                    )}
                />
            </div>
            {/* Unit Size */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Unit Size */}
                <div>
                    <form.AppField
                        name="unitSize"
                        children={(field:any) => (
                            <field.NumberField label="Unit Size" placeholder="Enter unit size" />
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
