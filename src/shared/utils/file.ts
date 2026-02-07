export const formatBytes = (
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) => {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

  if (bytes === 0) {
    return '0 Byte';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytest') : (sizes[i] ?? 'Bytes')
  }`;
};

export const convertBufferToFile = (
  buffer: ArrayLike<number> | ArrayBuffer,
  filename: string,
  type = 'image/png'
) => {
  const blob = new Blob([new Uint8Array(buffer)], { type });
  return new File([blob], filename, { type });
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(url);
};

export const getFilenameFromContentDisposition = (
  contentDisposition: string | null | undefined,
  fallback = 'download'
) => {
  if (!contentDisposition) return fallback;

  const match = /filename\s*=\s*"?([^";]+)"?/i.exec(contentDisposition);
  return match?.[1] ?? fallback;
};

export const base64ToBlob = (base64: string, contentType: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
};
