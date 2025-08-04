import React from 'react';
import { useFieldContext } from '../form';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

type Props = {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

const SelectField = ({ label, options, placeholder }: Props) => {
  const field = useFieldContext<string>();
  const hasError = !field.state.meta.isValid;
  const errorMessage = field.state.meta.errors[0]?.message;

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

        {hasError && <p className="text-sm text-destructive break-words">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SelectField;
