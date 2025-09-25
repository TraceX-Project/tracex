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
import { Upload, X } from 'lucide-react';
import { formatBytes } from '@/shared/utils/file';
import { useFieldContext } from '@/shared/tanstack-form/form';
import { Label } from '../ui/label';
import FieldErrors from './field-errors';

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : null}
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
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}

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
  label: string;
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
    ...dropzoneProps
  } = props;
  const field = useFieldContext<File | File[] | undefined>();

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
            setFiles([]);
            field.setValue(multiple || maxFiles > 1 ? [] : undefined);
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

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className="grid gap-3">
      <Label htmlFor={field.name} className="font-medium">
        {label}
      </Label>

      <div className="relative flex flex-col gap-1 overflow-hidden">
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
                className
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <Upload className="text-muted-foreground size-7" aria-hidden="true" />
                  </div>
                  <p className="text-muted-foreground font-medium">Drop the files here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <Upload className="text-muted-foreground size-7" aria-hidden="true" />
                  </div>
                  <div className="space-y-px">
                    <p className="text-muted-foreground font-medium">
                      <span className="rtl:hidden">
                        Drag {`'n'`} drop files here, or click to select files
                      </span>
                      <span className="ltr:hidden">
                        اسحب وأفلت الملفات هنا، أو انقر لتحديد الملفات
                      </span>
                    </p>
                    <p className="text-muted-foreground/70 text-sm">
                      You can upload
                      {maxFiles > 1
                        ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                        : ` a file with ${formatBytes(maxSize)}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        <FieldErrors meta={field.state.meta} />

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
      </div>
    </div>
  );
};

export default FileField;
