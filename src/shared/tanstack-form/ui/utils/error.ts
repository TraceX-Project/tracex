import { type FieldError } from '../types/form';

export const getErrorMessage = (error: FieldError): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  return 'Unknown error';
};
