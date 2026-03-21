'use client';

import { Button } from '@/shared/components/ui/button';
import { PATHS } from '@/shared/config/paths';
import { ChevronLeft, PlusIcon, RouterIcon, Server } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { type Project } from './_types/projects';
import CreateDeviceModal from '../logical-view/create-device-modal';
import ConnectHypervisorDialog from '../logical-view/connect-hypervisor-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { useParams, usePathname } from 'next/navigation';
import { Separator } from '@/shared/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import ManageFloors from '../buildings/manage-floors';
import { useGetBuildingById } from '../buildings/_hooks/use-get-building';
import { useRouter } from 'next/navigation';
import CreateRackModal from '../rooms/create-rack-modal';
import { useGetRoom } from '../floors/_hooks/use-get-room';
import { useGetFloorById } from '../floors/_hooks/use-floor';
import ProjectExportButton from './project-export-button';

type Props = {
  project: Project;
};

const ProjectNavbar = ({ project }: Props) => {
  const pathname = usePathname();
  const [createDeviceOpen, setCreateDeviceOpen] = useState(false);
  const [hypervisorOpen, setHypervisorOpen] = useState(false);
  const params = useParams<{
    projectId: string;
    buildingId?: string;
    floorId?: string;
    roomId?: string;
  }>();
  const { data: building } = useGetBuildingById(params.buildingId ?? '');
  const { data: floor } = useGetFloorById(params.floorId ?? '');
  const { data: room } = useGetRoom(params.roomId ?? '');

  const renderButtons = () => {
    if (params.buildingId && params.floorId && params.roomId) {
      return (
        <CreateRackModal
          roomId={params.roomId}
          title={'Manage Racks'}
          variant={'outline'}
          icon={<Server />}
        />
      );
    }
    if (params.buildingId && params.floorId) {
      return <ManageFloors buildingId={params.buildingId} />;
    }

    if (pathname.includes(PATHS.projects.logical(project.id))) {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PlusIcon className="size-4" />
                Add Device
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setCreateDeviceOpen(true)}>
                <RouterIcon className="size-4" />
                Router / Switch
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setHypervisorOpen(true)}>
                <Server className="size-4" />
                Server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CreateDeviceModal
            projectId={params.projectId}
            open={createDeviceOpen}
            onOpenChange={setCreateDeviceOpen}
          />
          <ConnectHypervisorDialog open={hypervisorOpen} onOpenChange={setHypervisorOpen} />
        </>
      );
    }

    if (pathname.includes(PATHS.projects.physical(project.id))) {
      return null;
    }
  };

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 border-b bg-white px-4 py-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={PATHS.projects.root}>
            <ChevronLeft />
          </Link>
        </Button>
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-foreground">
                <Link
                  href={
                    pathname.includes(PATHS.projects.physical(project.id))
                      ? PATHS.projects.physical(project.id)
                      : PATHS.projects.logical(project.id)
                  }
                >
                  {project.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {building && (
              <>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-foreground">
                    <Link href={PATHS.projects.buildingView(project.id, building.id)}>
                      {building.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {floor && building && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-foreground">
                    <Link href={PATHS.projects.floorView(project.id, building.id, floor.id)}>
                      {floor.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {floor && building && room && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-foreground">
                    <Link
                      href={PATHS.projects.roomView(project.id, building.id, floor.id, room.id)}
                    >
                      {room.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-x-2.5">
        {renderButtons()}

        <ProjectExportButton projectId={project.id} />
      </div>
    </header>
  );
};

export default ProjectNavbar;
