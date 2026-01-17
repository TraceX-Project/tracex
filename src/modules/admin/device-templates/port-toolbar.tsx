import { Button } from '@/shared/components/ui/button';
import { ArrowLeftRight, ArrowDownUp, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';
import { Alignment } from './_types/device-template';
import { usePortBoundingBoxStore } from './_store/port-boundingbox';

type Props = {
  onReindex: (mode: Alignment) => void;
};

const PortToolbar = ({ onReindex }: Props) => {
  const alignment = usePortBoundingBoxStore((state) => state.alignment);
  const selectedBoxId = usePortBoundingBoxStore((state) => state.selectedBoxId);
  const boxes = usePortBoundingBoxStore((state) => state.boxes);
  const { addNewBox, deleteSelectedBox } = usePortBoundingBoxStore((state) => state.actions);

  const handleAdd = () => {
    if (boxes.length === 0) {
      return addNewBox({
        x: 10,
        y: 10,
        width: 50,
        height: 50,
        portNumber: 1,
      });
    }

    const maxBox = boxes.reduce((a, b) => (b.portNumber > a.portNumber ? b : a));

    const { width, height, x, y, portNumber } = maxBox;

    addNewBox({
      x: x + width + 10,
      y,
      width,
      height,
      portNumber: portNumber + 1,
    });
  };

  const handleDelete = () => {
    deleteSelectedBox();

    onReindex(alignment);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" onClick={handleAdd}>
        <Plus size={16} />
      </Button>

      <Separator orientation="vertical" className="data-[orientation=vertical]:h-8" />

      <Button
        size="icon"
        variant={alignment === Alignment.HORIZONTAL ? 'default' : 'outline'}
        onClick={() => onReindex(Alignment.HORIZONTAL)}
        type='button'
      >
        <ArrowLeftRight className="size-4" />
      </Button>

      <Button
        size="icon"
        variant={alignment === Alignment.VERTICAL ? 'default' : 'outline'}
        onClick={() => onReindex(Alignment.VERTICAL)}
        type='button'
      >
        <ArrowDownUp className="size-4" />
      </Button>

      {selectedBoxId !== null && (
        <Button size="icon" variant="destructive" className="ml-auto" onClick={handleDelete}>
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default PortToolbar;
