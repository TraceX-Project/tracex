'use client';

import { FormType, useAppForm } from '@/shared/tanstack-form/form';
import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { deviceTemplateSchema, stepSchemas } from './_schema/schema';
import { useCreateDeviceTemplate } from './_hooks/use-create-device-template';
import { Vendor, DeviceType, Alignment, PortInput, PortType } from './_types/device-template';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/shared/components/ui/button';
import LabelingForm from './labeling-form';
import BasicInformationForm from './basic-information-form';
import UploadPanelForm from './upload-panel-form';
import { defineStepper } from '@stepperize/react';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const DeviceTemplateForm = () => {
  const { mutateAsync: createNewDeviceTemplate } = useCreateDeviceTemplate();
  const router = useRouter();

  const { useStepper, steps, utils } = defineStepper(
    { id: 'Basic', title: 'Basic Information' },
    { id: 'Upload', title: 'Upload Panel Image' },
    { id: 'Labeling', title: 'Labeling' }
  );

  const stepper = useStepper();
  const currentIndex = useMemo(
    () => utils.getIndex(stepper.current.id),
    [stepper.current.id, utils]
  );

  const form = useAppForm({
    defaultValues: {
      modelName: '',
      vendor: Vendor.CISCO,
      deviceType: DeviceType.ROUTER,
      rows: 1,
      columns: 1,
      alignment: Alignment.HORIZONTAL,
      frontPanel: null as unknown as File,
      unitSize: 1,
      ports: [] as PortInput[],
      portRanges: [
        {
          start: 1,
          end: 1,
          runningNumber: 1,
          prefix: '',
          portType: PortType.FAST_ETHERNET,
          id: uuidv4(),
        },
      ],
    },
    validators: { onChange: deviceTemplateSchema },
    onSubmit: async ({ value }) => {
      try {
        console.log('Create Device Template', value);

        // await createNewDeviceTemplate({
        //   ...value,
        //   rows: 1,
        //   columns: 1,
        //   alignment: Alignment.HORIZONTAL,
        //   ports: [],
        // });

        // toast.success('Device template created successfully');
        // router.push(PATHS.admin.deviceTemplates.root);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while creating the device template.'
        );
      }
    },
  });

  const validateStep = useCallback(
    async (stepId: keyof typeof stepSchemas) => {
      const schema = stepSchemas[stepId];
      const keys = Object.keys(schema.shape) as (keyof typeof schema.shape)[];

      const results = await Promise.all(
        keys.map(async (key) => {
          const result = await form.validateField(key, 'change');

          console.log(result);

          return Array.isArray(result) ? result.length === 0 : !result;
        })
      );

      return results.every(Boolean);
    },
    [form]
  );

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(stepper.current.id);
    if (!isValid) {
      return;
    }

    stepper.next();
  }, [stepper, validateStep]);

  const handleGoToStep = useCallback(
    async (targetStepId: keyof typeof stepSchemas) => {
      const currentIdx = stepper.all.findIndex((s) => s.id === stepper.current.id);
      const targetIdx = stepper.all.findIndex((s) => s.id === targetStepId);

      for (let i = currentIdx; i < targetIdx; i++) {
        const stepId = stepper.all[i].id;
        const valid = await validateStep(stepId);

        if (!valid) {
          stepper.goTo(stepper.all[i].id);
          return;
        }
      }

      stepper.goTo(targetStepId);
    },
    [stepper, validateStep]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Create Device Template</CardTitle>
        <Label>
          Step {currentIndex + 1} of {steps.length}
        </Label>
      </CardHeader>
      <CardContent>
        {/* Stepper Navigation */}
        <div className="group my-4 hidden sm:block" aria-label="Checkout Steps">
          <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
            {stepper.all.map((step, idx, arr) => (
              <React.Fragment key={step.id}>
                <li className="flex flex-shrink-0 items-center gap-4">
                  <Button
                    type="button"
                    role="tab"
                    variant={idx <= currentIndex ? 'default' : 'secondary'}
                    aria-current={stepper.current.id === step.id ? 'step' : undefined}
                    aria-posinset={idx + 1}
                    aria-setsize={steps.length}
                    aria-selected={stepper.current.id === step.id}
                    className="flex size-10 items-center justify-center rounded-full"
                    onClick={() => handleGoToStep(step.id)}
                  >
                    {idx + 1}
                  </Button>
                  <Label className="text-sm font-medium">{step.title}</Label>
                </li>
                {idx < arr.length - 1 && (
                  <Separator
                    className={`flex-1 ${idx < currentIndex ? 'bg-primary' : 'bg-muted'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </ol>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          {stepper.switch({
            Basic: () => <BasicInformationForm form={form as unknown as FormType} />,
            Upload: () => <UploadPanelForm form={form as unknown as FormType} />,
            Labeling: () => <LabelingForm form={form as unknown as FormType} />,
          })}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => router.push(PATHS.admin.deviceTemplates.root)}
            >
              Cancel
            </Button>
            <div className="flex gap-4">
              {!stepper.isFirst && (
                <Button variant="secondary" onClick={stepper.prev}>
                  Back
                </Button>
              )}
              {!stepper.isLast ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit}>Create</Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceTemplateForm;
