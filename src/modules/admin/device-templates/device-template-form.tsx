'use client';

import { useAppForm } from '@/shared/tanstack-form/form';
import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { deviceTemplateSchema, stepSchemas } from './_schema/schema';
import { useCreateDeviceTemplate } from './_hooks/use-create-device-template';
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
import { toast } from 'sonner';

const DeviceTemplateForm = () => {
  const { mutateAsync: createNewDeviceTemplate } = useCreateDeviceTemplate();
  const router = useRouter();

  const { useStepper, steps, utils } = defineStepper(
    { id: 'Basic', title: 'Basic Information' },
    { id: 'Upload', title: 'Upload Panel Image' },
    { id: 'Labelling', title: 'Labelling' }
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
    },
    validators: { onChange: deviceTemplateSchema },
    onSubmit: async ({ value }) => {
      try {
        await createNewDeviceTemplate({
          ...value,
          rows: 1,
          columns: 1,
          alignment: Alignment.HORIZONTAL,
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

  const validateStep = useCallback(
    async (stepId: keyof typeof stepSchemas) => {
      const schema = stepSchemas[stepId];
      const keys = Object.keys(schema.shape) as (keyof typeof schema.shape)[];

      const results = await Promise.all(
        keys.map(async (key) => {
          const result = await form.validateField(key, 'change');

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
        const valid = await validateStep(stepper.all[i].id);
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
        <CardTitle>Checkout</CardTitle>
        <Label>
          Step {currentIndex + 1} of {steps.length}
        </Label>
      </CardHeader>
      <CardContent>
        {/* Stepper Navigation */}
        <div className="group my-4" aria-label="Checkout Steps">
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
            Basic: () => <DeviceTemplateFirst form={form} />,
            Upload: () => <DeviceTemplateSecond form={form} />,
            Labelling: () => <DeviceTemplateComplete form={form} />,
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
                <Button onClick={handleSubmit}>Complete</Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceTemplateForm;
