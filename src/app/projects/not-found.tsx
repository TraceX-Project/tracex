import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="space-y-4 text-center">
        <div className="text-muted-foreground text-6xl font-bold">404</div>
        <h1 className="text-2xl font-semibold">Project Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission
          to access it.
        </p>
        <div className="space-x-2 pt-4">
          <Button asChild>
            <Link href={PATHS.projects.root}>View All Projects</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={PATHS.root}>Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
