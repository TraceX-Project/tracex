import React from 'react';
import { useFormContext } from '../form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

type Props = {
  label: string;
  className?: string;
};

const SubmitBtn = ({ label, className }: Props) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit} className={className}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            label
          )}
        </Button>
      )}
    />
  );
};

export default SubmitBtn;
