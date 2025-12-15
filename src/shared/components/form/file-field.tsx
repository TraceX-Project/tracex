'use client';

import * as React from 'react';
import Image from 'next/image';

import Dropzone, {
  type DropzoneInputProps,
  type DropzoneRootProps,
  type DropzoneProps,
  type FileRejection,
} from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { cn } from '@/shared/lib/cn';
import { FileArchive, FileCode, FileIcon, FileText, Upload, X } from 'lucide-react';
import { formatBytes } from '@/shared/utils/file';
import { useFieldContext } from '@/shared/tanstack-form/form';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

const getFileIcon = (file: File) => {
  const { type, name } = file;

  if (type === 'text/plain' || name.endsWith('.txt'))
    return <FileText className="text-muted-foreground size-6" />;

  if (type === 'application/zip' || name.endsWith('.zip'))
    return <FileArchive className="text-muted-foreground size-6" />;

  if (
    type === 'application/json' ||
    name.endsWith('.json') ||
    name.endsWith('.yaml') ||
    name.endsWith('.yml')
  )
    return <FileCode className="text-muted-foreground size-6" />;

  return <FileIcon className="text-muted-foreground size-6" />;
};

const FileCard = ({ file, progress, onRemove }: FileCardProps) => {
  const isImage = file.type.startsWith('image/') && isFileWithPreview(file);

  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isImage ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="bg-muted flex items-center justify-center rounded-md p-2">
            {getFileIcon(file)}
          </div>
        )}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="text-foreground/80 line-clamp-1 text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">{formatBytes(file.size)}</p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" className="size-7" onClick={onRemove}>
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
};

const isFileWithPreview = (file: File): file is File & { preview: string } => {
  return 'preview' in file && typeof file.preview === 'string';
};

interface FileFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFiles?: DropzoneProps['maxFiles'];
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const FileField = (props: FileFieldProps) => {
  const {
    label,
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    description,
    ...dropzoneProps
  } = props;
  const field = useFieldContext<File | File[] | undefined>();
  const hasErrors = field.state.meta.errors.length > 0;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      field.setValue(multiple || maxFiles > 1 ? updatedFiles : updatedFiles[0]);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
        const target = updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },

    [field, files, maxFiles, multiple, onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    field.setValue(multiple || maxFiles > 1 ? newFiles : newFiles[0]);
    onValueChange?.(newFiles);
  }

  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  React.useEffect(() => {
    const fieldValue = field.state.value;

    if (fieldValue && (!files || files.length === 0)) {
      if (multiple || maxFiles > 1) {
        const fieldFiles = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        const filesWithPreview = fieldFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        setFiles(filesWithPreview);
      } else {
        const file = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        setFiles([fileWithPreview]);
      }
    }
  }, [field.state.value]);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <Field orientation="vertical">
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldContent className="relative flex flex-col gap-1 overflow-hidden">
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={maxFiles > 1 || multiple}
          disabled={isDisabled}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
          }: {
            getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
            getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
            isDragActive: boolean;
          }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
                'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                isDragActive && 'border-muted-foreground/50',
                isDisabled && 'pointer-events-none opacity-60',
                hasErrors && 'border-red-500 bg-red-50',
                className
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div
                    className={cn(
                      'rounded-full border border-dashed p-3',
                      hasErrors && 'border-red-400'
                    )}
                  >
                    <Upload
                      className={cn('text-muted-foreground size-7', hasErrors && 'text-red-500')}
                    />
                  </div>
                  <p
                    className={cn('text-muted-foreground font-medium', hasErrors && 'text-red-600')}
                  >
                    Drop the files here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div
                    className={cn(
                      'rounded-full border border-dashed p-3',
                      hasErrors && 'border-red-400'
                    )}
                  >
                    <Upload
                      className={cn('text-muted-foreground size-7', hasErrors && 'text-red-500')}
                    />
                  </div>
                  <div className="space-y-px">
                    <p
                      className={cn(
                        'text-muted-foreground font-medium',
                        hasErrors && 'text-red-600'
                      )}
                    >
                      Drag &apos;n&apos; drop files here, or click to select files
                    </p>
                    <p
                      className={cn(
                        'text-muted-foreground/70 text-sm',
                        hasErrors && 'text-red-500'
                      )}
                    >
                      You can upload {maxFiles} files
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        <FieldError errors={field.state.meta.errors} />

        {files?.length ? (
          <ScrollArea className="mt-6 h-fit w-full px-3">
            <div className="max-h-48 space-y-4">
              {files?.map((file, index) => (
                <FileCard
                  key={index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              ))}
            </div>
          </ScrollArea>
        ) : null}
      </FieldContent>
    </Field>
  );
};

export default FileField;
