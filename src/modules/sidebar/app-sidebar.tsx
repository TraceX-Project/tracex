'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/components/ui/sidebar';
import NavUser from './nav-user';
import NavHeader from './nav-header';
import NavMain from './nav-main';
import NavAdmin from './nav-admin';
import { useGetProfile } from '../auth/_hooks/use-get-profile';
import { UserRole } from '../auth/_types/user';

const AppSidebar = () => {
  const { data: user } = useGetProfile();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        {isAdmin && <NavAdmin />}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
