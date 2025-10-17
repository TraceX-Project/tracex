'use client';

import { Label } from '@/shared/components/ui/label';
import React, { useCallback, useEffect } from 'react';
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import Image from 'next/image';
import { formatBytes } from '@/shared/utils/file';
import { Progress } from '@/shared/components/ui/progress';
import { Button } from '@/shared/components/ui/button';
import { Upload, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useFieldContext } from '../form';
import { type UploadAttachmentResponse } from '@/modules/attachments/_types/attachments';
import FieldErrors from './field-errors';

function isFileWithPreview(file: File): file is File & { preview?: string } {
  return 'preview' in file && typeof file.preview === 'string';
}

type FileCardProps = {
  file: File;
  onRemove: () => void;
  progress?: number;
};

const FileCard = ({ file, onRemove, progress }: FileCardProps) => {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            src={String(file.preview)}
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={progress !== undefined && progress < 100}
          className="size-8 rounded-full"
        >
          <X className="text-muted-foreground" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
};

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  multiple?: boolean;
  progresses?: Record<string, number>;
  maxFiles?: DropzoneProps['maxFiles'];
  maxSize?: DropzoneProps['maxSize'];
  accept?: DropzoneProps['accept'];
  disabled?: boolean;
  value?: File[];
  onUpload?: (files: File[]) => Promise<UploadAttachmentResponse[]>;
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileUploader = ({
  label,
  multiple = false,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 2, // 2MB
  accept = { 'image/*': ['.jpeg', '.jpg', '.png'] },
  disabled,
  progresses,
  value: valueProp,
  onUpload,
  onValueChange,
  className,
  ...dropzoneProps
}: FileUploaderProps) => {
  const field = useFieldContext<string[] | string | null>();
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than one file');
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

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} is not accepted. Please check the file type and size.`);
        });
      }

      if (onUpload && updatedFiles?.length > 0 && updatedFiles?.length <= maxFiles) {
        const target = updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: (uploadedFiles) => {
            if (uploadedFiles.length > 0) {
              if (maxFiles === 1) {
                field.setValue(uploadedFiles[0]?.id);
              } else {
                field.setValue(uploadedFiles.map((file) => file.id));
              }
            }

            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },
    [files, maxFiles, multiple, onUpload, setFiles]
  );

  const onRemove = (index: number) => {
    if (!files) {
      return;
    }

    const newFiles = files.filter((_, i) => i !== index);

    setFiles(newFiles);
    onValueChange?.(newFiles);
  };

  useEffect(() => {
    return () => {
      if (!files) {
        return;
      }

      files.forEach((file: File & { preview?: string }) => {
        if (isFileWithPreview(file) && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const isDisabled = disabled ?? (files?.length ?? 0) >= maxFiles;

  return (
    <div className="grid gap-3">
      <Label htmlFor={field.name} className="font-medium">
        {label}
      </Label>

      <div className="relative flex flex-col gap-6 overflow-hidden">
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          disabled={isDisabled}
          maxFiles={maxFiles}
          maxSize={maxSize}
          multiple={maxFiles > 1 || multiple}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
                'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
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
                      Drag {`'n'`} drop files here, or click to select files
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
          <ScrollArea className="h-fit w-full px-3">
            <div className="max-h-48 space-y-4">
              {files.map((file, index) => (
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

export default FileUploader;
