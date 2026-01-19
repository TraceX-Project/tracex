'use client';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { useRouter } from 'next/navigation';
import { MoveLeft, House } from 'lucide-react';

type Resource = 'project' | 'building' | 'floor' | 'room';
type Status = 400 | 404;

export default function NotFoundPage({
  resource,
  status = 404,
}: {
  resource: Resource;
  status?: Status;
}) {
  const router = useRouter();
  let title = '';
  let description = '';
  if (status === 400) {
    title = '400 Bad Request';
    description = `Invalid ${resource} UUID`;
  } else if (status === 404) {
    title = '404 Not Found';
    description = `We couldn't find that ${resource}`;
  } else {
    title = 'Unexpected Error';
    description = 'Unexpected Error please try again';
  }

  return (
    <section className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-center text-9xl font-extrabold text-neutral-300">{title}</h1>
      <div className="mt-8 flex flex-col items-center gap-4 text-2xl">
        <p className="text-muted-foreground text-lg font-medium">{description}</p>
        <div className="flex gap-4">
          <Button onClick={() => router.back()}>
            <MoveLeft />
            Go Back
          </Button>
          {resource !== 'project' && (
            <Button variant="outline" asChild>
              <Link href={PATHS.projects.root}>
                <House />
                Go Home
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
