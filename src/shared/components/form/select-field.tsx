import { useFieldContext } from '@/shared/tanstack-form/form';
import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import FieldErrors from './field-errors';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

const SelectField = ({ label, placeholder, options }: Props) => {
  const field = useFieldContext<string | undefined>();
  return (
    <div className="grid gap-3">
      <Label htmlFor={field.name} className="font-medium">
        {label}
      </Label>

      <div className="flex flex-col gap-1">
        <Select defaultValue={field.state.value} onValueChange={field.handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FieldErrors meta={field.state.meta} />
      </div>
    </div>
  );
};

export default SelectField;
