'use client';

import { type FormType, useAppForm } from '@/shared/tanstack-form/form';
import React, { type FormEvent, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { deviceTemplateSchema, stepSchemas } from './_schema/schema';
import { useCreateDeviceTemplate } from './_hooks/use-create-device-template';
import {
  Vendor,
  DeviceType,
  Alignment,
  PortType,
  type BoundingBox,
} from './_types/device-template';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/shared/components/ui/button';
import BasicInformationForm from './basic-information-form';
import UploadPanelForm from './upload-panel-form';
import { defineStepper } from '@stepperize/react';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';
import PortConfigForm from './port-config-form';

const DeviceTemplateForm = () => {
  const { mutateAsync: createNewDeviceTemplate } = useCreateDeviceTemplate();
  const router = useRouter();

  const { useStepper, steps, utils } = defineStepper(
    { id: 'Basic', title: 'Basic Information' },
    { id: 'Upload', title: 'Upload Panel Image' },
    { id: 'Labeling', title: 'Labeling' }
  );

  type StepId = (typeof steps)[number]['id'];

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
      boundingBoxes: [] as BoundingBox[],
    },
    validators: { onChange: deviceTemplateSchema },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();

        formData.append('modelName', value.modelName);
        formData.append('vendor', value.vendor);
        formData.append('deviceType', value.deviceType);
        formData.append('rows', value.rows.toString());
        formData.append('columns', value.columns.toString());
        formData.append('alignment', value.alignment);
        formData.append('unitSize', value.unitSize.toString());
        formData.append('frontPanel', value.frontPanel);
        formData.append('portRanges', JSON.stringify(value.portRanges));
        formData.append('boundingBoxes', JSON.stringify(value.boundingBoxes));

        await createNewDeviceTemplate(formData);

        toast.success('Device Template created successfully');
        router.push(PATHS.admin.deviceTemplates.root);
      } catch (error) {
        toast.error('Failed to create template');
      }
    },
  });

  const validateStep = useCallback(
    async (stepId: StepId): Promise<boolean> => {
      try {
        const schema = stepSchemas[stepId];
        const formValues = form.state.values as Record<string, unknown>;

        const stepFields: Record<string, unknown> = {};
        if (schema && 'shape' in schema) {
          for (const fieldName of Object.keys(schema.shape)) {
            stepFields[fieldName] = formValues[fieldName];
          }

          const validationResult = schema.safeParse(stepFields);

          if (validationResult.success) {
            return true;
          }

          const validationPromises = validationResult.error.issues.map(async (issue) => {
            const fieldName = issue.path[0];
            if (typeof fieldName === 'string') {
              return form.validateField(fieldName as keyof typeof form.state.values, 'change');
            }
          });

          await Promise.allSettled(validationPromises);
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error during step validation:', error);
        return false;
      }
    },
    [form]
  );

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(stepper.current.id);

    if (!isValid) {
      toast.error('Please fill in all required fields correctly.');
      return;
    }

    stepper.next();
  }, [stepper, validateStep]);

  const handleGoToStep = useCallback(
    async (targetStepId: StepId) => {
      const currentIdx = stepper.all.findIndex((s) => s.id === stepper.current.id);
      const targetIdx = stepper.all.findIndex((s) => s.id === targetStepId);

      if (targetIdx < currentIdx) {
        stepper.goTo(targetStepId);
        return;
      }

      for (let i = currentIdx; i < targetIdx; i++) {
        const stepId = stepper.all[i].id;
        const valid = await validateStep(stepId);
        if (!valid) {
          stepper.goTo(stepper.all[i].id);
          toast.error(`Please complete step: ${stepper.all[i].title}`);
          return;
        }
      }

      stepper.goTo(targetStepId);
    },
    [stepper, validateStep]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group my-4">
            <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
              {stepper.all.map((step, idx, arr) => (
                <React.Fragment key={step.id}>
                  <li className="flex flex-shrink-0 items-center gap-4">
                    <Button
                      type="button"
                      role="tab"
                      variant={idx <= currentIndex ? 'default' : 'secondary'}
                      className="flex size-10 items-center justify-center rounded-full"
                      onClick={() => handleGoToStep(step.id)}
                      disabled={form.state.isSubmitting}
                    >
                      {idx + 1}
                    </Button>

                    <Label className="hidden text-sm font-medium lg:block">{step.title}</Label>
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
          <div className="min-h-[300px]">
            {stepper.switch({
              Basic: () => <BasicInformationForm form={form as unknown as FormType} />,
              Upload: () => <UploadPanelForm form={form as unknown as FormType} />,
              Labeling: () => <PortConfigForm form={form as unknown as FormType} />,
              // Labeling: () => <LabelingForm form={form as unknown as FormType} />,
            })}
          </div>

          {/* Navigation Buttons Footer */}
          <div className="flex items-center justify-between border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(PATHS.admin.deviceTemplates.root)}
              disabled={form.state.isSubmitting}
            >
              Cancel
            </Button>

            <div className="flex gap-4">
              {!stepper.isFirst && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={stepper.prev}
                  disabled={form.state.isSubmitting}
                >
                  Back
                </Button>
              )}

              {!stepper.isLast ? (
                <Button type="button" onClick={handleNext} disabled={form.state.isSubmitting}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeviceTemplateForm;
