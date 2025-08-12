import { Label } from '@/shared/components/ui/label';
import React from 'react';
import { useFieldContext } from '../form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/cn';
import { type FieldError } from './types/form';
import { getErrorMessage } from './utils/error';

type Props = {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

const NumberField = ({ label, placeholder, disabled, required }: Props) => {
  const field = useFieldContext<number>();
  const hasError = !field.state.meta.isValid;
  const error = field.state.meta.errors[0] as FieldError;

  return (
    <div className="grid gap-3">
      <Label htmlFor={field.name} className="font-medium">
        {label}
      </Label>

      <div className="flex flex-col gap-1">
        <Input
          type="number"
          id={field.name}
          name={field.name}
          value={Number.isNaN(field.state.value) ? '' : field.state.value}
          placeholder={placeholder}
          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
          disabled={disabled}
          required={required}
          onBlur={field.handleBlur}
          className={cn(hasError && 'border-destructive focus-visible:ring-destructive')}
        />

        {hasError && (
          <p className="text-destructive text-sm break-words">{getErrorMessage(error)}</p>
        )}
      </div>
    </div>
  );
};

export default NumberField;
