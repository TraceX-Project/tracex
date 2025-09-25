import { useFieldContext } from '@/shared/tanstack-form/form';
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import FieldErrors from './field-errors';

interface Props extends React.ComponentProps<'input'> {
  label: string;
}

const TextField = ({ label, ...inputProps }: Props) => {
  const field = useFieldContext<string>();

  return (
    <div className="grid gap-3">
      <Label htmlFor={field.name} className="font-medium">
        {label}
      </Label>

      <div className="flex flex-col gap-1">
        <Input
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...inputProps}
        />

        <FieldErrors meta={field.state.meta} />
      </div>
    </div>
  );
};

export default TextField;
