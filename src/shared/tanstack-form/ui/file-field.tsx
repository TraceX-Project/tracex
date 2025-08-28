'use client';

import { Label } from '@/shared/components/ui/label';
import React, { useCallback, useState } from 'react';
import { useFieldContext } from '../form';
import Dropzone, { type Accept, type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

type Props = {
  label: string;
  placeholder?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  accept?: Accept;
  disabled?: boolean;
  onFileSelect?: (files: File[]) => void;
};

function isFileWithPreview(file: File | FileRejection): file is File & { preview?: string } {
  return 'preview' in file && typeof file.preview === 'string';
}

const FileField = ({
  label,
  placeholder,
  multiple = false,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 2, // 2MB
  accept = { 'image/*': ['.jpeg', '.jpg', '.png'] },
  disabled,
  onFileSelect,
}: Props) => {
  const [files, _setFiles] = useState<File[]>([]);
  const field = useFieldContext<File[] | File | null>();

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

      const newFiles = acceptedFiles.map((file) => {
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        return file;
      });

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      _setFiles(updatedFiles);

      // Call the onFileSelect callback if provided
      if (onFileSelect) {
        onFileSelect(updatedFiles);
      }

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} is not accepted. Please check the file type and size.`);
        });
      }
    },
    [files, maxFiles, multiple, onFileSelect]
  );

  // const onRemoveFile = useCallback(
  //   (file: File) => {
  //     _setFiles((prevFiles) => {
  //       const updatedFiles = prevFiles.filter((f) => f.name !== file.name);
  //       field.handleChange(multiple ? updatedFiles : updatedFiles[0] || null);
  //       return updatedFiles;
  //     });
  //   },
  //   [field, multiple]
  // );

  React.useEffect(() => {
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
  }, [files]);

  return (
    <div className="grid gap-3">
      <Label htmlFor={field.name} className="font-medium">
        {label}
      </Label>

      <div>
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          disabled={disabled}
          maxFiles={maxFiles}
          maxSize={maxSize}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4">
              <input {...getInputProps()} />
              {files && files.length > 0 ? (
                files.map((file, index) => (
                  <img
                    key={index}
                    src={(file as File & { preview?: string }).preview}
                    alt={`Preview of ${file.name}`}
                    style={{ maxWidth: 'full', maxHeight: 'full', marginRight: '8px' }}
                  />
                ))
              ) : (
                <p>
                  {placeholder ??
                    'Drag &apos;n&apos; drop some files here, or click to select files'}
                </p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default FileField;
