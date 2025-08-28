import LoginCard from '@/modules/auth/login-card';
import { PATHS } from '@/shared/config/paths';
import { Network } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Network className="size-4" />
          </div>
          TraceX
        </a>

        <LoginCard />

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <Link href={PATHS.terms}>Terms of Service</Link>{' '}
          and <Link href={PATHS.privacy}>Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
