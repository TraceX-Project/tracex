'use client';

import { type PropsWithChildren } from 'react';
import { getQueryClient } from './get-query-client';
import { QueryClientProvider } from '@tanstack/react-query';

export function ReactQueryProvider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}
