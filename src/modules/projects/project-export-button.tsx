'use client';

import React, { useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import { IconFileExport } from '@tabler/icons-react';
import { FileDown, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { DocumentFormat } from './_types/projects';
import { toast } from 'sonner';
import { useGenerateDocument } from './_hooks/use-generate-document';
import { base64ToBlob, downloadFile } from '@/shared/utils/file';

type Props = {
  projectId: string;
};

const ProjectExportButton = ({ projectId }: Props) => {
  const { mutateAsync: generateDocument } = useGenerateDocument();

  const handleGenerateDocument = useCallback(async (format: DocumentFormat) => {
    try {
      const { data, contentType, filename } = await generateDocument({ projectId, format });
      const blob = base64ToBlob(data, contentType);

      downloadFile(blob, filename);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while generating the document.'
      );
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <IconFileExport size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleGenerateDocument(DocumentFormat.PDF)}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleGenerateDocument(DocumentFormat.DOCX)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectExportButton;
