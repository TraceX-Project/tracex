import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { type Rack } from "./_types/room"
import { IconDotsVertical, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"
import { Button } from "@/shared/components/ui/button"
import { ConfirmDialog } from "@/shared/components/confirm-dialog"
import { useCallback } from "react"
import { useDeleteRack } from "./_hooks/use-delete-rack"
import { toast } from "sonner"
import { useBoolean } from "@/shared/hooks/use-boolean"
import EditRackDialog from "./edit-rack-dialog"
import AddDevicesToRackModal from "./add-devices-to-rack-modal"

type Props = {
  rack: Rack
}

const RackActionsMenu = ({ rack }: Props) => {
  const { value: isDeleteDialogOpen, setValue: setDeleteDialogOpen } = useBoolean()
  const { value: editRackOpen, setValue: setEditRackOpen } = useBoolean()
  const { value: addDevicesToRackOpen, setValue: setAddDevicesToRackOpen } = useBoolean()
  const { mutateAsync: deleteRack } = useDeleteRack()

  const handleDeleteRack = useCallback(async () => {
    try {
      await deleteRack(rack.id)
      toast.success("Rack deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete rack")
    }
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setAddDevicesToRackOpen(true)} disabled={rack.usedUnits === rack.unitSize}>
            <IconPlus className="size-4" />
            Add devices
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditRackOpen(true)}>
            <IconEdit className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <IconTrash className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteRack}
        title="Are you absolutely sure?"
        description={`Are you sure you want to delete ${rack.name}?`}
      />

      <EditRackDialog
        rack={rack}
        open={editRackOpen}
        onOpenChange={setEditRackOpen}
      />

      <AddDevicesToRackModal
        open={addDevicesToRackOpen}
        onOpenChange={setAddDevicesToRackOpen}
        rack={rack}
      />
    </>
  )
}

export default RackActionsMenu