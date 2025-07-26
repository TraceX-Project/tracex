'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { DEVICE_BRAND, DEVICE_TYPE } from './_constants/device';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

const createDeviceSchema = z.object({
  modelName: z
    .string()
    .min(1, {
      message: 'Model name is required',
    })
    .max(50, {
      message: 'Model name must be at most 50 characters',
    }),
  brand: z.enum(
    DEVICE_BRAND.map((b) => b.value),
    {
      message: 'Invalid device brand',
    }
  ),
  type: z.enum(
    DEVICE_TYPE.map((type) => type.value),
    {
      message: 'Invalid device type',
    }
  ),
  unitSize: z
    .number({ message: 'Unit size must be a number' })
    .int({ message: 'Unit size must be an integer' })
    .positive({ message: 'Unit size must be greater than zero' }),
});

const CreateDeviceModal = () => {
  const form = useForm({
    defaultValues: {
      modelName: '',
      brand: '',
      type: '',
      unitSize: 1,
    },
    onSubmit: (values) => {
      console.log('create device: ', values);
    },
    validators: {
      onChange: createDeviceSchema,
    },
  });

  return (
    <Dialog>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <Button>Create New Device</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Device</DialogTitle>
            <DialogDescription>
              Fill out the information below to create a new device.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <form.Field
              name="modelName"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="modelName">Model</Label>
                  <Input
                    id="modelName"
                    name="modelName"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            />

            <form.Field
              name="brand"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {DEVICE_BRAND.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <form.Field
              name="type"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {DEVICE_TYPE.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <form.Field
              name="unitSize"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="unit-size">Unit Size</Label>
                  <Input
                    id="unit-size"
                    name="unit-size"
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {/* Save changes */}
                  {isSubmitting ? '...' : 'Save changes'}
                </Button>
              )}
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateDeviceModal;
