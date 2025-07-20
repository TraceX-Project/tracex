'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/components/ui/sidebar';
import NavUser from './nav-user';
import { useGetProfile } from '../auth/_hooks/use-get-profile';
import NavHeader from './nav-header';
import NavMain from './nav-main';
import NavAdmin from './nav-admin';

const AppSidebar = () => {
  const { data: user } = useGetProfile();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavAdmin />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
