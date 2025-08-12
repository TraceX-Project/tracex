import { type AnyFieldMeta } from '@tanstack/react-form';
import React from 'react';

type Props = {
  meta: AnyFieldMeta;
};

const parseError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  } else {
    console.error('Unrecognised error', error);
    return JSON.stringify(error);
  }
};

const FieldErrors = ({ meta }: Props) => {
  if (!meta.isTouched || meta.isValid || !meta.isBlurred) {
    return null;
  }

  return meta.errors.map(parseError).map((error, index) => (
    <p key={index} className="text-destructive text-sm break-words">
      {error}
    </p>
  ));
};

export default FieldErrors;
