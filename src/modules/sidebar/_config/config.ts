import { PATHS } from '@/shared/config/paths';
import { Folder, Users, Monitor } from 'lucide-react';

export const navMain = [
  {
    title: 'My Projects',
    url: PATHS.projects.root,
    icon: Folder,
    tooltip: 'View your projects',
  },
];

export const navAdmin = [
  {
    title: 'Manage Users',
    url: PATHS.admin.users,
    icon: Users,
    tooltip: 'Manage users',
  },
  {
    title: 'Manage Devices',
    url: PATHS.admin.devices.root,
    icon: Monitor,
    tooltip: 'Manage devices',
  },
];
