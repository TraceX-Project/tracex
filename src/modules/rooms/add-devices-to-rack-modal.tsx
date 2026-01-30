import { useAppForm } from "@/shared/tanstack-form/form";
import { type Rack } from "./_types/room";
import { addDevicesToRackSchema } from "./_schema/schema";
import { useGetPhysicalDevices } from "./_hooks/use-get-physical-devices";
import { useParams } from "next/navigation";
import { type FormEvent, useCallback, useMemo } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useAddDevicesToRack } from "./_hooks/use-add-devices-to-rack";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rack: Rack
};

const AddDevicesToRackModal = ({ open, onOpenChange, rack }: Props) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: physicalDevices } = useGetPhysicalDevices(projectId, {
    inRack: false
  })
  const { mutateAsync: addDevicesToRack } = useAddDevicesToRack()

  const physicalDeviceOptions = useMemo(() => {
    return physicalDevices?.map((device) => ({
      value: device.id,
      label: device.name,
    })) ?? []
  }, [physicalDevices])

  const form = useAppForm({
    defaultValues: {
      deviceIds: [] as string[]
    },
    validators: {
      onSubmit: addDevicesToRackSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await addDevicesToRack({
          rackId: rack.id,
          roomId: rack.roomId,
          data: {
            devices: value.deviceIds.map((id) => ({
              deviceId: id,
            })),
          },
        })

        form.reset()
        onOpenChange(false)
      } catch (error) {
        console.error(error)

        toast.error("Failed to add devices to rack")
      }
    }
  })

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Devices to Rack</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <form.AppField
              name="deviceIds"
              children={(field) => (
                <field.MultipleSelectField
                  overflowBehavior="cutoff"
                  label="Select Devices"
                  options={physicalDeviceOptions}
                  placeholder="Select devices"
                />
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>Cancel</Button>
            </DialogClose>

            <form.AppForm>
              <form.SubmitButton>Add</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDevicesToRackModal;