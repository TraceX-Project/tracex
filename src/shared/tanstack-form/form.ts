import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import SubmitBtn from './ui/submit-btn';
import TextField from './ui/text-field';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitBtn,
  },
});
