import { useFieldContext } from '@/shared/tanstack-form/form';
import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Field, FieldLabel, FieldContent, FieldError, FieldDescription } from '../ui/field';

interface SelectOption {
  value: string;
  label: string;
}

interface Props extends React.ComponentProps<'select'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  showErrorMessage?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}

const SelectField = ({
  label,
  placeholder,
  options,
  description,
  showErrorMessage = true,
  orientation = 'vertical',
  ...selectProps
}: Props) => {
  const field = useFieldContext<string | undefined>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <Field orientation={orientation}>
      {orientation !== 'vertical' && description ? (
        <FieldContent>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
      ) : (
        <>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
        </>
      )}

      <Select defaultValue={field.state.value} onValueChange={field.handleChange}>
        <SelectTrigger className="w-full" aria-invalid={hasErrors}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <SelectItem
              key="no-options"
              value="__no_option__"
              disabled
              className="pointer-events-none justify-center py-4"
            >
              <span className="flex w-full justify-center">No options</span>
            </SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {showErrorMessage && hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default SelectField;
