import { ChangingViewButton } from '@/modules/logical-view/changing-view-button';
import ProjectNavbar from '@/modules/projects/project-navbar';

type Props = {
  children: React.ReactNode;
};

export default async function LogicalViewLayout({ children }: Props) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="flex h-full flex-col">
        <ProjectNavbar />
        <div>
          <ChangingViewButton />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
