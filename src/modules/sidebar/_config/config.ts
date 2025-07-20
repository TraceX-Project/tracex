import { PATHS } from '@/shared/config/paths';
import { Folder, Users, Monitor } from 'lucide-react';

export const navMain = [
  {
    title: 'My Projects',
    url: PATHS.projects,
    icon: Folder,
  },
];

export const navAdmin = [
  {
    title: 'Manage Users',
    url: PATHS.admin.users,
    icon: Users,
  },
  {
    title: 'Manage Devices',
    url: PATHS.admin.devices,
    icon: Monitor,
  },
];
