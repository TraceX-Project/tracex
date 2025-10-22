import React from 'react';
import { Input } from '../ui/input';
import { useFieldContext } from '@/shared/tanstack-form/form';
import FieldErrors from './field-errors';
import { Label } from '../ui/label';

interface Props extends React.ComponentProps<'input'> {
  label?: string;
}

const NumberField = ({ label, ...inputProps }: Props) => {
  const field = useFieldContext<number>();

  return (
    <div className="grid gap-3">
      {label && (
        <Label htmlFor={field.name} className="font-medium">
          {label}
        </Label>
      )}

      <div className="flex flex-col gap-1">
        <Input
          type="number"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
          {...inputProps}
        />

        <FieldErrors meta={field.state.meta} />
      </div>
    </div>
  );
};

export default NumberField;
