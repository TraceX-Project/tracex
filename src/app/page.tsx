import { redirect } from 'next/navigation';
import { PATHS } from '@/shared/config/paths';

export default async function HomePage() {
  redirect(PATHS.projects);
}
