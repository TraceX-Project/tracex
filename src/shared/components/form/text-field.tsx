import React from 'react';
import { Field, FieldLabel, FieldContent, FieldError, FieldDescription } from '../ui/field';
import { Input } from '../ui/input';
import { useFieldContext } from '@/shared/tanstack-form/form';

interface Props extends React.ComponentProps<'input'> {
  label?: string;
  description?: string;
  showErrorMessage?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}

const TextField = ({
  label,
  description,
  showErrorMessage = true,
  orientation = 'vertical',
  type,
  ...inputProps
}: Props) => {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.handleBlur();

    const {value} = e.target;
    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    e.target.value = trimmedValue;
    field.handleChange(trimmedValue);
  };

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

      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={handleOnBlur}
        aria-invalid={hasErrors}
        type={type}
        {...inputProps}
      />

      {showErrorMessage && hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default TextField;
