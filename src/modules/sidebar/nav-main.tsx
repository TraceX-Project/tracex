'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { navMain } from './_constants/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/cn';
import { FilePlus } from 'lucide-react';
import { useProjectModalStore } from '../projects/_store/project-modal.store';
import { PATHS } from '@/shared/config/paths';

const NavMain = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsOpen } = useProjectModalStore((state) => state.actions);

  const handleNewProjectClick = () => {
    if (!pathname.startsWith('/projects')) {
      router.push(PATHS.projects.root);
    }

    setIsOpen(true);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create a new project"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={handleNewProjectClick}
            >
              <FilePlus className="size-4" />
              <span>New Project</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.tooltip}
                className={cn(item.url === pathname && 'bg-muted text-primary')}
                asChild
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavMain;
