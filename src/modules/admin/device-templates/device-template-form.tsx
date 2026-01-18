"use client"

import { type FormType, useAppForm } from "@/shared/tanstack-form/form"
import { deviceTemplateSchema, stepSchemas } from "./_schema/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { type FormEvent, useCallback, useMemo } from "react"
import { defineStepper } from "@stepperize/react"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"
import { PATHS } from "@/shared/config/paths"

import { DeviceType, type DeviceTemplateFormData, Alignment } from "./_types/device-template"
import { useStore } from "@tanstack/react-form"
import BasicInfoForm from "./basic-info-form"
import LabelingForm from "./labeling-form"
import { useCreateDeviceTemplate } from "./_hooks/use-create-device-template"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const { useStepper: useStandardStepper, steps: standardSteps, utils: standardUtils } = defineStepper(
  { id: "info", title: "Information" },
  { id: 'labeling', title: 'Labeling' }
)

const { useStepper: useServerStepper, steps: serverSteps, utils: serverUtils } = defineStepper(
  { id: "info", title: "Information" }
)

type StepId = (typeof standardSteps)[number]['id']

const DeviceTemplateForm = () => {
  const router = useRouter()
  const { mutateAsync: createDeviceTemplate } = useCreateDeviceTemplate()
  const form = useAppForm({
    defaultValues: {
      modelName: "",
      vendor: undefined,
      deviceType: undefined,
      unitSize: undefined,
      frontPanel: undefined,
      alignment: Alignment.HORIZONTAL,
      portRanges: [],
      boundingBoxes: [],
    } as unknown as DeviceTemplateFormData,
    validators: {
      onSubmit: deviceTemplateSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await createDeviceTemplate(value)

        toast.success("Device template created successfully");

        router.push(PATHS.admin.deviceTemplates.root);
      } catch (error) {
        toast.error("Failed to create device template");
        console.error(error);
      }
    }
  })

  const deviceType = useStore(
    form.store,
    (state) => (state.values).deviceType
  )
  const isServer = deviceType === DeviceType.SERVER

  const standardStepper = useStandardStepper()
  const serverStepper = useServerStepper()

  const stepper = isServer ? serverStepper : standardStepper
  const steps = isServer ? serverSteps : standardSteps

  const currentIndex = useMemo(() => {
    return isServer ? serverUtils.getIndex(serverStepper.current.id) : standardUtils.getIndex(standardStepper.current.id)
  }, [isServer, serverStepper, standardStepper, serverUtils, standardUtils])


  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }, [form])

  const validateStep = async (stepId: StepId): Promise<boolean> => {
    try {
      const schema = stepSchemas[stepId];
      const formValues = form.state.values as Record<string, unknown>
      const validationResult = schema.safeParse(formValues)

      if (validationResult.success) {
        return true
      }

      const validationPromises = validationResult.error.issues.map(async (issue) => {
        const fieldName = issue.path[0]
        if (typeof fieldName === 'string') {
          return form.validateField(fieldName as keyof typeof form.state.values, 'submit')
        }
      })

      await Promise.allSettled(validationPromises)

      return false
    } catch (error) {
      return false
    }
  }

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(stepper.current.id);

    if (!isValid) {
      return;
    }

    stepper.next();
  }, [stepper, validateStep]);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Create Device Template</CardTitle>
        <p>Step {currentIndex + 1} of {steps.length}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} >
          <div className="space-y-6">
            {stepper.switch({
              info: () => <BasicInfoForm form={form as unknown as FormType} />,
              labeling: () => <LabelingForm form={form as unknown as FormType} />,
            })}

            <div className="flex justify-between gap-4">
              <Button type="button" variant="secondary" asChild>
                <Link href={PATHS.admin.deviceTemplates.root}>Cancel</Link>
              </Button>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={stepper.isFirst}
                  onClick={stepper.prev}
                >
                  Back
                </Button>

                {stepper.isLast ? (
                  <Button type="submit" key="submit">Submit</Button>
                ) : (
                  <Button type="button" onClick={handleNext} key="next">
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DeviceTemplateForm