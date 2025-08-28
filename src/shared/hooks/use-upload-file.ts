'use client';

import { useState } from 'react';
import { useBoolean } from './use-boolean';
import { type UploadAttachmentResponse } from '@/modules/attachments/_types/attachments';
import { toast } from 'sonner';
import { useUploadAttachment } from '@/modules/attachments/_hooks/use-upload-attachment';

export function useUploadFile() {
  const { mutateAsync: uploadAttachment } = useUploadAttachment();
  const { value: isUploading, setValue: setIsUploading } = useBoolean(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadAttachmentResponse[]>([]);

  const onUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const results = await Promise.all(files.map((file) => uploadAttachment(file)));
      setUploadedFiles(results);

      return results;
    } catch (error) {
      toast.error('Failed to upload files');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    onUpload,
    uploadedFiles,
    isUploading,
  };
}
