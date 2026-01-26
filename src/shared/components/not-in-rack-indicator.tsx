import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from '@/shared/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';

const NotInRackIndicator = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute -top-2 -right-2 rounded-full bg-white p-0.5 shadow-sm">
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Not in Rack</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotInRackIndicator;
