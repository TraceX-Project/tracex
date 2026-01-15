'use client';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { useRouter } from 'next/navigation';
import { MoveLeft, House } from 'lucide-react';

type Resource = 'project' | 'building' | 'floor' | 'room';

export default function NotFoundPage({ resource }: { resource: Resource }) {
  const router = useRouter();
  return (
    <section className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-9xl font-extrabold text-neutral-300">404 Not Found</h1>
      <div className="mt-8 flex flex-col items-center gap-4 text-2xl">
        <p className="text-muted-foreground text-lg font-medium">
          Oops! That {resource.toLowerCase()} could not be found.
        </p>
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
