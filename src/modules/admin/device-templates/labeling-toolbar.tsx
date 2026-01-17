
import { Button } from "@/shared/components/ui/button";
import { ArrowDownUp, ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { Alignment } from "./_types/device-template";

type Props = {
  alignment: Alignment
  onAdd: () => void
  onDelete: () => void
  onReindex: (alignment: Alignment) => void
}

export const LabelingToolbar = ({ alignment, onAdd, onDelete, onReindex }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button type='button' size="icon" onClick={onAdd}>
        <Plus size={16} />
      </Button>

      <Separator orientation="vertical" className="data-[orientation=vertical]:h-8" />

      <Button
        type='button'
        size="icon"
        variant={alignment === Alignment.HORIZONTAL ? 'default' : 'outline'}
        onClick={() => onReindex(Alignment.HORIZONTAL)}
      >
        <ArrowLeftRight className="size-4" />
      </Button>

      <Button
        type='button'
        size="icon"
        variant={alignment === Alignment.VERTICAL ? 'default' : 'outline'}
        onClick={() => onReindex(Alignment.VERTICAL)}
      >
        <ArrowDownUp className="size-4" />
      </Button>

      <Button type="button" size="icon" variant="destructive" className="ml-auto" onClick={onDelete}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
