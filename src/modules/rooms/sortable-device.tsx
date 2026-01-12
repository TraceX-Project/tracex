'use client';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';;
import { cn } from '@/shared/lib/cn';
import Image from 'next/image';


type Props = {
    frontURL: string;
    id: string;
};

const SortableDevice = ({ frontURL, id }: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                'w-full flex flex-col cursor-grab active:cursor-grabbing',
                isDragging && 'shadow-lg z-50'
            )}
        >
            <Image
                src={frontURL}
                alt={frontURL}
                className=""
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                width={300}
                height={1}
            />
        </div>
    );
};

export default SortableDevice;
