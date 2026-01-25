'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { PATHS } from '@/shared/config/paths';
import { useGetProjects } from './_hooks/use-get-projects';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { useCallback } from 'react';
import { useDeleteProject } from './_hooks/use-delete-project';
import { toast } from 'sonner';
import { Skeleton } from '@/shared/components/ui/skeleton';
import EmptyProject from './empty-project';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import EditProjectModal from './edit-project-modal';
import { type Project } from './_types/projects';

type ProjectItemProps = {
  project: Project
};

const ProjectItem = ({ project }: ProjectItemProps) => {
  const { mutateAsync: deleteProject } = useDeleteProject();
  const { value: isOpen, toggle: toggleIsOpen } = useBoolean(false);
  const { value: isEditOpen, setValue: setIsEditOpen } = useBoolean(false);

  const handleDelete = useCallback(async () => {
    try {
      await deleteProject(project.id);

      toast.success(`Project ${project.name} deleted successfully!`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while deleting the project.'
      );
    }
  }, [project.id, project.name, deleteProject]);

  return (
    <>
      <div className="overflow-hidden rounded-md border bg-white shadow transition-shadow duration-300 hover:shadow-lg">
        <Link href={PATHS.projects.logical(project.id)} passHref>
          <Image
            src="https://www.cisco.com/content/dam/cisco-cdc/site/images/legacy/assets/swa/img/anchor-info/network-designed-628x353.jpg"
            alt={project.name}
            width={400}
            height={250}
            className="h-48 w-full cursor-pointer object-cover"
          />
        </Link>

        <div className="flex items-center justify-between p-4">
          <h3 className="truncate text-base font-semibold">{project.name}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Project actions"
                className="h-6 w-6 p-1"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setIsEditOpen(true);
                }}
              >
                <IconPencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={toggleIsOpen}>
                <IconTrash className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={toggleIsOpen}
        title="Confirm Project Deletion"
        description={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />

      <EditProjectModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        project={project}
      />
    </>
  );
};

const ProjectSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-md border shadow">
      <Skeleton className="h-48 w-full" />
      <div className="flex items-center justify-between p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
};

const ProjectList = () => {
  const { data: projects, isLoading } = useGetProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <EmptyProject />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
