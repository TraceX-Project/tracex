import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppForm } from '@/shared/tanstack-form/form';
import { useCallback, type FormEvent, useMemo } from 'react';
import { toast } from 'sonner';
import { HYPERVISOR_VENDORS_OPTIONS } from './_constants/logical-view';
import { connectHypervisorSchema } from './_schema/schema';
import DevicePortSelector from './device-port-selector';
import { useGetDeviceTemplates } from '../admin/device-templates/_hooks/use-get-device-templates';
import { DeviceType } from '../admin/device-templates/_types/device-template';
import { useGetServer } from './_hooks/use-get-server';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
}

const EditServerModal = ({ open, onOpenChange, deviceId }: Props) => {
  const { data: server } = useGetServer(deviceId);
  const { data: deviceTemplates } = useGetDeviceTemplates({
    type: [DeviceType.SERVER],
  });

  const deviceTemplateOptions = useMemo(
    () =>
      deviceTemplates?.map((template) => ({
        label: template.modelName,
        value: template.id,
      })) ?? [],
    [deviceTemplates]
  );

  const form = useAppForm({
    defaultValues: {
      name: server?.name,
      apiKey: '',
      vendor: server?.vendor,
      apiUrl: server?.apiUrl,
      connectPortIds: [] as string[],
      deviceTemplateId: server?.deviceTemplateId,
    },
    validators: {
      onSubmit: connectHypervisorSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log(value);

        onOpenChange(false);
      } catch (error) {
        toast.error('Failed to connect hypervisor. Please try again.');
      }
    },
  });

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Connect to a hypervisor</DialogTitle>
            <DialogDescription>
              Once connect, the system will pull VMs information using the API key given.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Name  */}
            <div className="flex gap-4">
              <form.AppField
                name="name"
                children={(field) => <field.TextField label="Name" placeholder="Enter name" />}
              />

              {/* Vendor */}
              <form.AppField
                name="vendor"
                children={(field) => (
                  <field.SelectField
                    label="Vendor"
                    options={HYPERVISOR_VENDORS_OPTIONS}
                    placeholder="Select a vendor"
                  />
                )}
              />
            </div>

            {/* Device Template */}
            <form.AppField
              name="deviceTemplateId"
              children={(field) => (
                <field.SelectField
                  label="Device Template"
                  placeholder="Select a device template"
                  options={deviceTemplateOptions}
                />
              )}
            />

            {/* API URL */}
            <form.AppField
              name="apiUrl"
              children={(field) => (
                <field.TextField label="API URL" placeholder="Enter API URL" type="url" />
              )}
            />

            {/* API Key */}
            <form.AppField
              name="apiKey"
              children={(field) => (
                <field.TextField label="API Key" placeholder="Enter API Key" type="password" />
              )}
            />

            {/* Connect Ports */}
            <form.AppField
              name="connectPortIds"
              children={(field) => <DevicePortSelector initDeviceId={deviceId} />}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Connect</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditServerModal