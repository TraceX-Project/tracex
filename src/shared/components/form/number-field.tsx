import React from 'react';
import { Field, FieldLabel, FieldContent, FieldError, FieldDescription } from '../ui/field';
import { Input } from '../ui/input';
import { useFieldContext } from '@/shared/tanstack-form/form';

interface Props extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string;
  description?: string;
  showErrorMessage?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}

const NumberField = ({
  label,
  description,
  showErrorMessage = true,
  orientation = 'vertical',
  ...inputProps
}: Props) => {
  const field = useFieldContext<number | null>();
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

      <Input
        id={field.name}
        type="number"
        value={
          Number.isNaN(field.state.value) || field.state.value == null ? '' : field.state.value
        }
        onChange={(e) => {
          const { value } = e.target;

          if (value === '') {
            field.handleChange(null);
            return;
          }

          const num = e.target.valueAsNumber;

          field.handleChange(Number.isNaN(num) ? null : num);
        }}
        aria-invalid={hasErrors}
        {...inputProps}
      />

      {showErrorMessage && hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default NumberField;
