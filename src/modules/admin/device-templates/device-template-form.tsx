'use client';

import { useAppForm } from '@/shared/tanstack-form/form';
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { deviceTemplateSchema } from './_schema/schema';
import { useCreateDeviceTemplate } from './_hooks/use-create-device-template';
import { toast } from 'sonner';
import { Vendor, DeviceType, Alignment, PortInput } from './_types/device-template';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/shared/components/ui/button';
import { DeviceTemplateComplete } from './device-template-complete';
import { DeviceTemplateFirst } from './device-template-first';
import { DeviceTemplateSecond } from './device-template-second';
import { defineStepper } from '@stepperize/react';
import { Separator } from '@/shared/components/ui/separator';

const DeviceTemplateForm = () => {
  const { mutateAsync: createNewDeviceTemplate } = useCreateDeviceTemplate();
  const router = useRouter();
  const { useStepper, steps, utils } = defineStepper(
        { id: "Basic", title: "Basic Information", description: "First step" },
        { id: "Upload", title: "Upload Panel Image", description: "Second step" },
        { id: "Labelling", title: "Labelling", description: "Third step" }
    );
    
  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);

  const form = useAppForm({
    defaultValues: {
      modelName: '',
      vendor: Vendor.CISCO,
      deviceType: DeviceType.ROUTER,
      rows:1,
      columns:1,
      alignment: Alignment.HORIZONTAL,
      frontPanelUrl: '',
      unitSize: 1,
      ports: [] as PortInput[],
    },
    validators: {
      onChange: deviceTemplateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createNewDeviceTemplate({
          modelName: value.modelName,
          vendor: value.vendor,
          deviceType: value.deviceType,
          frontPanelUrl: value.frontPanelUrl,
          rows: 1,
          columns: 1,
          alignment: Alignment.HORIZONTAL,
          unitSize: value.unitSize,
          ports: [],
        });

        toast.success('Device template created successfully');
        router.push(PATHS.admin.deviceTemplates.root);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while creating the device template.'
        );
      }
    },
  });

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className='flex justify-between items-center'>
            <CardTitle>Checkout</CardTitle>
            <Label>Step {currentIndex + 1} of {steps.length}</Label>
        </CardHeader>
        <CardContent>
            <div aria-label="Checkout Steps" className="group my-4">
                <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
                    {stepper.all.map((step, index, array) => (
                        <React.Fragment key={step.id}>
                            <li className="flex items-center gap-4 flex-shrink-0">
                                <Button
                                    type="button"
                                    role="tab"
                                    variant={index <= currentIndex ? 'default' : 'secondary'}
                                    aria-current={
                                        stepper.current.id === step.id ? 'step' : undefined
                                    }
                                    aria-posinset={index + 1}
                                    aria-setsize={steps.length}
                                    aria-selected={stepper.current.id === step.id}
                                    className="flex size-10 items-center justify-center rounded-full"
                                    onClick={() => stepper.goTo(step.id)}
                                >
                                    {index + 1}
                                </Button>
                                <Label className="text-sm font-medium">{step.title}</Label>
                            </li>
                            {index < array.length - 1 && (
                                <Separator
                                    className={`flex-1 ${index < currentIndex ? 'bg-primary' : 'bg-muted'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </ol>
            </div>
            <div className="space-y-4">
                {stepper.switch({
                    Basic: () => <DeviceTemplateFirst form={form} />,
                    Upload: () => <DeviceTemplateSecond form={form} />,
                    Labelling: () => <DeviceTemplateComplete form={form} />,
                })}
                {!stepper.isLast ? (
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="secondary"
                            onClick={stepper.prev}
                            disabled={stepper.isFirst}
                        >
                            Back
                        </Button>
                        <Button onClick={stepper.next}>
                            {stepper.isLast ? 'Complete' : 'Next'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-4">
                      <Button
                            variant="secondary"
                            onClick={stepper.prev}
                            disabled={stepper.isFirst}
                        >
                            Back
                        </Button>
                        <Button onClick={() =>handleSubmit}>Complete</Button>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
};

export default DeviceTemplateForm;
