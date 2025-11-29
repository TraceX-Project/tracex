'use client';

import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { ChevronLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { type Project } from './_types/projects';
import CreateDeviceModal from '../logical-view/create-device-modal';
import { IconFileExport } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { Separator } from '@/shared/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { useQueryStates } from 'nuqs';
import { parseAsUUID } from '@/shared/utils/parsers';
import ManageFloors from '../buildings/manage-floors';
import { useGetBuilding } from '../buildings/_hooks/use-get-building';

type Props = {
  project: Project;
};

const ProjectNavbar = ({ project }: Props) => {
  const pathname = usePathname();
  const [query, _] = useQueryStates({
    buildingId: parseAsUUID,
    floorId: parseAsUUID,
    roomId: parseAsUUID,
  });
  const { data: building } = useGetBuilding(query.buildingId ?? '');

  const renderButtons = () => {
    if (query.buildingId) {
      return <ManageFloors buildingId={query.buildingId} />;
    }

    if (pathname.includes(PATHS.projects.logical(project.id))) {
      return <CreateDeviceModal />;
    }

    if (pathname.includes(PATHS.projects.physical(project.id))) {
      return null;
    }
  };

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 border-b bg-white px-4 py-2">
      <div className="flex items-center gap-2">
        <Link href={PATHS.projects.root}>
          <Button variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        </Link>
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
            {building && (
              <>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbPage>{building.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-x-2.5">
        {renderButtons()}

        <Button size="sm" variant="outline">
          <Share2 className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="outline">
          <IconFileExport size={16} />
        </Button>
      </div>
    </header>
  );
};

export default ProjectNavbar;
