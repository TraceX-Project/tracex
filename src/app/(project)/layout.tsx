import { SidebarProvider } from '@/shared/components/ui/sidebar';
import AppSidebar from '@/modules/sidebar/app-sidebar';
import { cookies } from 'next/headers';

type Props = {
  children: React.ReactNode;
};

export default async function ProjectLayout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div>{children}</div>
    </SidebarProvider>
  );
}
