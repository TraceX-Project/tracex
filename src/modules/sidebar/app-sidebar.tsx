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
import { User } from '../auth/_types/user';

const AppSidebar = () => {
  const { data: user } = useGetProfile();

  console.log('user', user);

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
        <NavUser user={user as User} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
