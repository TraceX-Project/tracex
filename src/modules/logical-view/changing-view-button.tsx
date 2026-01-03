'use client';

import Link from 'next/link';
import { cn } from '@/shared/lib/cn';
import { usePathname } from 'next/navigation';

const ChangingViewTabs = () => {
  const pathname = usePathname();
  const isLogical = pathname.includes('/logical');

  const tabs = [
    {
      label: 'Logical View',
      href: pathname.replace(/\/physical.*/, '/logical'),
      active: isLogical,
    },
    {
      label: 'Physical View',
      href: pathname.replace('logical', 'physical'),
      active: !isLogical,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div
        data-slot="tabs-list"
        className={cn(
          'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]'
        )}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            prefetch={true}
            data-slot="tabs-trigger"
            className={cn(
              'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5',
              'rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap',
              'transition-[color,box-shadow]',
              'focus-visible:ring-[3px] focus-visible:outline-1',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring',
              'disabled:pointer-events-none disabled:opacity-50',
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              'dark:text-muted-foreground text-foreground',
              {
                'bg-black text-white shadow-sm': tab.active,
              }
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChangingViewTabs;
