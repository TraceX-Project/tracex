import { useFieldContext } from '@/shared/tanstack-form/form';
import React from 'react';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/shared/components/ui/multi-select';
import { Field, FieldLabel, FieldContent, FieldError, FieldDescription } from '../ui/field';
import { cn } from '@/shared/lib/cn';

interface Option {
  value: string;
  label: string;
}

interface Props extends Omit<React.ComponentProps<typeof MultiSelectTrigger>, 'form'> {
  label?: string;
  options: Option[];
  placeholder?: string;
  description?: string;
  showErrorMessage?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  overflowBehavior: 'wrap-when-open' | 'wrap' | 'cutoff';
  single?: boolean;
  emptyMessage?: string;
  search?: boolean | { placeholder?: string; emptyMessage?: string };
}

const MultipleSelectField = ({
  label,
  placeholder,
  options,
  description,
  showErrorMessage = true,
  orientation = 'vertical',
  className,
  search,
  overflowBehavior,
  single = false,
  ...triggerProps
}: Props) => {
  const field = useFieldContext<string[]>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <div className='min-w-0 w-full'>
      <Field orientation={orientation}>
        <MultiSelect
          single={single}
          values={field.state.value || []}
          onValuesChange={(values) => field.handleChange(values)}
        >
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

          <MultiSelectTrigger className={cn("w-full min-w-0", className)} aria-invalid={hasErrors} {...triggerProps}>
            <MultiSelectValue placeholder={placeholder} overflowBehavior={overflowBehavior} />
          </MultiSelectTrigger>
          <MultiSelectContent search={search}>
            <MultiSelectGroup>
              {options.map((option) => (
                <MultiSelectItem key={option.value} value={option.value}>
                  {option.label}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>

        {showErrorMessage && hasErrors && <FieldError errors={field.state.meta.errors} />}
      </Field>
    </div>
  );
};

export default MultipleSelectField;
