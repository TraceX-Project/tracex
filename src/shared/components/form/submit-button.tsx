import { useFormContext } from '@/shared/tanstack-form/form';
import { useStore } from '@tanstack/react-form';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

type Props = React.ComponentProps<'button'>;

const SubmitButton = ({ className, children, ...props }: Props) => {
  const form = useFormContext();
  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ]);

  return (
    <Button {...props} type="submit" disabled={!canSubmit || isSubmitting} className={className}>
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
