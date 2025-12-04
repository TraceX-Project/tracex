"use client";

import { type FormType, useAppForm } from '@/shared/tanstack-form/form';
import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { deviceTemplateSchema, stepSchemas } from './_schema/schema';
import { useCreateDeviceTemplate } from './_hooks/use-create-device-template';
import { Vendor, DeviceType, Alignment, PortType, type boundingBox } from './_types/device-template';
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
import { Loader2 } from 'lucide-react'; // เพิ่ม icon loading

const  DeviceTemplateForm = () => {
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
      boundingBoxes: [] as boundingBox[],
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
        if (value.frontPanel) {
          formData.append('frontPanel', value.frontPanel);
        }
        formData.append('portRanges', JSON.stringify(value.portRanges));
        formData.append('boundingBoxes', JSON.stringify(value.boundingBoxes));
        await createNewDeviceTemplate(formData);
        toast.success("Device Template created successfully");
        router.push(PATHS.admin.deviceTemplates.root);  
      } catch (error) {
        console.error("Submit Error:", error);
        toast.error("Failed to create template");
      }
    },
  });

  const validateStep = useCallback(
    async (stepId: StepId): Promise<boolean> => {
      try {
        const schema = stepSchemas[stepId];
        // Access values safely
        const formValues = form.state.values as Record<string, unknown>;

        const stepFields: Record<string, unknown> = {};
        // ดึงเฉพาะ field ที่เกี่ยวข้องกับ step นั้นๆ มา validate
        if (schema && 'shape' in schema) {
             for (const fieldName of Object.keys(schema.shape)) {
                stepFields[fieldName] = formValues[fieldName];
              }
      
              const validationResult = schema.safeParse(stepFields);
      
              if (validationResult.success) {
                return true;
              }
      
              // Trigger UI errors for invalid fields
              const validationPromises = validationResult.error.issues.map(async (issue) => {
                const fieldName = issue.path[0];
                if (typeof fieldName === 'string') {
                  // Cast type ให้ตรงกับ library
                  return form.validateField(fieldName as keyof typeof form.state.values, 'change');
                }
              });
      
              await Promise.allSettled(validationPromises);
              return false;
        }
        return true; // ถ้าไม่มี schema ถือว่าผ่าน
      } catch (error) {
        console.error('Error during step validation:', error);
        return false;
      }
    },
    [form]
  );

  const handleNext = useCallback(async () => {
    // Prevent moving next if validating
    const isValid = await validateStep(stepper.current.id);
    if (!isValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    stepper.next();
  }, [stepper, validateStep]);

  const handleGoToStep = useCallback(
    async (targetStepId: StepId) => {
      // Logic เดินข้าม Step เช็ค validation ย้อนหลัง
      const currentIdx = stepper.all.findIndex((s) => s.id === stepper.current.id);
      const targetIdx = stepper.all.findIndex((s) => s.id === targetStepId);

      // ถ้าจะย้อนกลับ (Back) ให้ไปได้เลยไม่ต้อง validate
      if (targetIdx < currentIdx) {
        stepper.goTo(targetStepId);
        return;
      }

      // ถ้าจะเดินหน้า ต้อง validate ทุก step ระหว่างทาง
      for (let i = currentIdx; i < targetIdx; i++) {
        const stepId = stepper.all[i].id;
        const valid = await validateStep(stepId);
        if (!valid) {
          stepper.goTo(stepper.all[i].id); // หยุดที่ step ที่ไม่ผ่าน
          toast.error(`Please complete step: ${stepper.all[i].title}`);
          return;
        }
      }

      stepper.goTo(targetStepId);
    },
    [stepper, validateStep]
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
        {/* แก้ไข 1: ใช้ <form> เดียวครอบทั้งหมด และจัดการ onSubmit 
            โดยการเรียก form.handleSubmit() ของ TanStack Form
        */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >

          {/* Stepper Navigation */}
          <div className="group my-4 hidden sm:block" aria-label="Checkout Steps">
            <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
              {stepper.all.map((step, idx, arr) => (
                <React.Fragment key={step.id}>
                  <li className="flex flex-shrink-0 items-center gap-4">
                    <Button
                      type="button" // Important: type="button" เพื่อไม่ให้ submit form
                      role="tab"
                      variant={idx <= currentIndex ? 'default' : 'secondary'}
                      className="flex size-10 items-center justify-center rounded-full"
                      onClick={() => handleGoToStep(step.id)}
                      disabled={form.state.isSubmitting} // Disable ตอน submit
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
          <div className="min-h-[300px]">
            {stepper.switch({
              Basic: () => <BasicInformationForm form={form as unknown as FormType} />,
              Upload: () => <UploadPanelForm form={form as unknown as FormType} />,
              Labeling: () => <LabelingForm form={form as unknown as FormType} />,
            })}
          </div>

          {/* Navigation Buttons Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
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
                <Button 
                    type="button" 
                    onClick={handleNext}
                    disabled={form.state.isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button 
                    type="submit" 
                    disabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                    </>
                  ) : (
                    "Create"
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