import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import SubmitBtn from './ui/submit-btn';
import TextField from './ui/text-field';
import SelectField from './ui/select-field';
import NumberField from './ui/number-field';
import FileField from './ui/file-field';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    SelectField,
    NumberField,
    FileField,
  },
  formComponents: {
    SubmitBtn,
  },
});
