import { ChangingViewButton } from '@/modules/logical-view/changing-view-button';
import ProjectNavbar from '@/modules/projects/project-navbar';

type Props = {
  children: React.ReactNode;
};

export default function ProjectLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <ProjectNavbar />

      <div className="relative flex flex-1 flex-col">
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
          <ChangingViewButton />
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
