'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/cn';

export const ChangingViewButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isLogical = pathname.includes('/logical');

  const buttons = [
    {
      label: 'Logical View',
      active: isLogical,
      onclick: () => {
        if (!isLogical) {
          router.push(pathname.replace('physical', 'logical'));
        }
      },
    },
    {
      label: 'Physical View',
      active: !isLogical,
      onclick: () => {
        if (isLogical) {
          router.push(pathname.replace('logical', 'physical'));
        }
      },
    },
  ];

  return (
    <div className="flex w-fit items-center justify-center gap-4 rounded-md border bg-white px-2 py-2 shadow-md">
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onclick}
          size="sm"
          className={cn(
            'transition-colors duration-300 ease-in-out',
            button.active
              ? 'bg-primary text-white'
              : 'text-primary hover:bg-accent hover:text-accent-foreground border bg-white'
          )}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};
