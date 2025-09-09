import { PATHS } from '@/shared/config/paths';
import Link from 'next/link';
import React from 'react';

const ProjectNavbar = () => {
  return (
    <div>
      <Link href={PATHS.root}>Back to Home</Link>
    </div>
  );
};

export default ProjectNavbar;
