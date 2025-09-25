import { cn } from '@/shared/lib/cn';
import { type AnyFieldMeta } from '@tanstack/react-form';
import { type ZodError } from 'zod';

interface Props extends React.ComponentProps<'p'> {
  meta: AnyFieldMeta;
}

const FieldErrors = ({ meta, className, ...props }: Props) => {
  if (!meta.isTouched && meta.errors.length === 0) {
    return null;
  }

  return meta.errors.map(({ message }: ZodError, index: number) => (
    <p key={index} className={cn('text-destructive text-sm break-words', className)} {...props}>
      {message}
    </p>
  ));
};

export default FieldErrors;
