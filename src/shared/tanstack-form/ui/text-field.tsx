import { Label } from '@/shared/components/ui/label';
import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { useFieldContext } from '../form';
import { cn } from '@/shared/lib/cn';

type Props = {
  label: string;
};

const TextField = ({ label }: Props) => {
  const field = useFieldContext<string>();
  const hasError = !field.state.meta.isValid;
  const errorMessage = field.state.meta.errors[0]?.message;

  return (
    <div className="grid gap-3">
      <Label htmlFor={field.name} className="font-medium">
        {label}
      </Label>
      <div className="flex flex-col gap-1">
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn(hasError && 'border-destructive focus-visible:ring-destructive')}
        />

        {hasError && <p className="text-sm text-destructive break-words">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default TextField;
