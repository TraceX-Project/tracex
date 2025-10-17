import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import FileField from '../components/form/file-field';
import SubmitButton from '../components/form/submit-button';
import TextField from '../components/form/text-field';
import SelectField from '../components/form/select-field';
import NumberField from '../components/form/number-field';


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
    // SubmitBtn,
    SubmitButton,
  },
});
