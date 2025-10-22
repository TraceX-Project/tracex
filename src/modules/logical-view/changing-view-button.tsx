'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { useBoolean } from '@/shared/hooks/use-boolean';

export const ChangingViewButton = () => {
  const { value: open, setValue: setOpen } = useBoolean(true);
  return (
    <div className="flex w-fit items-center justify-center gap-4 rounded-md border bg-white px-2 py-2 shadow-md">
      <Button variant={`${open ? 'default' : 'outline'}`} onClick={() => setOpen(true)}>
        Logical View
      </Button>
      <Button variant={`${!open ? 'default' : 'outline'}`} onClick={() => setOpen(false)}>
        Physical View
      </Button>
    </div>
  );
};
