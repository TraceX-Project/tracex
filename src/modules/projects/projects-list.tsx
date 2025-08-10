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
import DeleteProjectModal from './delete-project-modal';
import { useBoolean } from '@/shared/hooks/use-boolean';
import { useCallback } from 'react';
import { useDeleteProject } from './_hooks/use-delete-project';
import { toast } from 'sonner';
import { Skeleton } from '@/shared/components/ui/skeleton';

type ProjectItemProps = {
  name: string;
  id: string;
};

const ProjectItem = ({ name, id }: ProjectItemProps) => {
  const { mutateAsync: deleteProject } = useDeleteProject();
  const { value: isOpen, toggle: toggleIsOpen, setFalse: setIsOpenFalse } = useBoolean(false);

  const handleDelete = useCallback(async () => {
    try {
      await deleteProject(id);

      toast.success(`Project ${name} deleted successfully!`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while deleting the project.'
      );
    }
  }, [id, name, deleteProject]);

  return (
    <div className="border rounded-md overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
      <Link href={PATHS.projects.detail(id)} passHref>
        <Image
          src="https://www.cisco.com/content/dam/cisco-cdc/site/images/legacy/assets/swa/img/anchor-info/network-designed-628x353.jpg"
          alt={name}
          width={400}
          height={250}
          className="object-cover w-full h-48 cursor-pointer"
        />
      </Link>

      <div className="flex items-center justify-between p-4">
        <h3 className="text-base font-semibold truncate">{name}</h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Project actions"
              className="p-1 w-6 h-6"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={PATHS.projects.edit(id)}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={toggleIsOpen}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteProjectModal
        open={isOpen}
        onOpenChange={toggleIsOpen}
        projectName={name}
        onConfirm={handleDelete}
      />
    </div>
  );
};

const ProjectSkeleton = () => {
  return (
    <div className="border rounded-md overflow-hidden shadow">
      <Skeleton className="w-full h-48" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!projects || projects.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
        <p className="text-lg font-medium">No projects yet</p>
        <p className="text-sm text-gray-400 mb-6">
          Create your first project to start using the system.
        </p>
        <Button asChild>
          <Link href={PATHS.projects.new}>New Project</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {projects.data.map((project) => (
        <ProjectItem key={project.id} name={project.name} id={project.id} />
      ))}
    </div>
  );
};

export default ProjectList;
