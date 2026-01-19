'use client';
import React from 'react';
import { useFieldContext } from '@/shared/tanstack-form/form';
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
} from '@/shared/components/ui/multi-select'; // Adjust path to where you saved the code above
import { Field, FieldLabel, FieldError, FieldDescription } from '../ui/field';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  showErrorMessage?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  overflowBehavior?: 'wrap' | 'wrap-when-open' | 'cutoff';
  disabled?: boolean;
}

const MultiSelectField = ({
  label,
  placeholder,
  options,
  description,
  showErrorMessage = true,
  orientation = 'vertical',
  overflowBehavior = 'wrap-when-open',
  disabled,
}: Props) => {
  const field = useFieldContext<string[]>();
  const hasErrors = field.state.meta.errors.length > 0;
  console.log('overflow', overflowBehavior);

  // TanStack Form uses an array; MultiSelect handles the Set conversion internally
  const selectedValues = Array.isArray(field.state.value) ? field.state.value : [];

  return (
    <Field orientation={orientation}>
      <div className="flex flex-col gap-1">
        {label && <FieldLabel>{label}</FieldLabel>}
        {description && <FieldDescription>{description}</FieldDescription>}
      </div>

      <MultiSelect
        values={selectedValues}
        onValuesChange={(newValues) => field.handleChange(newValues)}
      >
        <MultiSelectTrigger
          disabled={disabled}
          className={hasErrors ? 'border-destructive ring-destructive/20 w-full' : 'w-full'}
        >
          <MultiSelectValue
            placeholder={placeholder}
            overflowBehavior={overflowBehavior}
            className="min-w-0"
          />
        </MultiSelectTrigger>

        <MultiSelectContent search={{ placeholder: 'Search options...' }}>
          {options.length === 0 ? (
            <div className="text-muted-foreground p-4 text-center text-sm">No results found.</div>
          ) : (
            options.map((option) => (
              <MultiSelectItem key={option.value} value={option.value}>
                {option.label}
              </MultiSelectItem>
            ))
          )}
        </MultiSelectContent>
      </MultiSelect>

      {showErrorMessage && hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default MultiSelectField;
