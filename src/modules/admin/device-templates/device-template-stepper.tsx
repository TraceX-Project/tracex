import React, { useCallback } from 'react'
import { defineStepper } from '@stepperize/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { DEVICE_PORT_ALIGNMENT_OPTIONS, DEVICE_VENDORS_OPTIONS, DEVICE_TYPES_OPTIONS } from './_constants/device-template';
import type { AppFieldExtendedReactFormApi } from '@/shared/types/forms';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Label } from '@radix-ui/react-label';
import { DeviceTemplateFirst } from './device-template-first';
import { DeviceTemplateSecond } from './device-template-second';
import { DeviceTemplateComplete } from './device-template-complete';

type DeviceTemplateStepperProps = {
    form: AppFieldExtendedReactFormApi;
};

export const DeviceTemplateStepper = ({ form }: DeviceTemplateStepperProps) => {
    const { useStepper, steps, utils } = defineStepper(
        { id: "Basic", title: "Basic Information", description: "First step" },
        { id: "Upload", title: "Upload Panel Image", description: "Second step" },
        { id: "Labelling", title: "Labelling", description: "Third step" }
    );
    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          form.handleSubmit();
        },
        [form]
    );
    
    const stepper = useStepper();
    const currentIndex = utils.getIndex(stepper.current.id);
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
                            <Button onClick={() =>handleSubmit}>Complete</Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
