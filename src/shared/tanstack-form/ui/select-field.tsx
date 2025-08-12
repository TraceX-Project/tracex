import React from 'react';
import { useFieldContext } from '../form';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { type FieldError } from './types/form';
import { getErrorMessage } from './utils/error';

type Props = {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

const SelectField = ({ label, options, placeholder }: Props) => {
  const field = useFieldContext<string>();
  const hasError = !field.state.meta.isValid;
  const error = field.state.meta.errors[0] as FieldError;

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

        {hasError && (
          <p className="text-destructive text-sm break-words">{getErrorMessage(error)}</p>
        )}
      </div>
    </div>
  );
};

export default SelectField;
