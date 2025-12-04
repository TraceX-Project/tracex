import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/shared/components/ui/sidebar';
import { Network } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { PATHS } from '@/shared/config/paths';

const NavHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href={PATHS.root}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Network className="size-4" />
            </div>
            <span className="text-xl font-bold">TraceX</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavHeader;
