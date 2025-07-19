import { SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar';
import AppSidebar from '@/modules/sidebar/app-sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ProjectLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div>
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  );
}
