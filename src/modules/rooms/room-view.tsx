'use client';

import React from 'react';
import { useGetRacks } from './_hooks/use-get-racks';
import EmptyRacks from './empty-racks';
import IsLoadingPage from '../../shared/components/is-loading';
import RoomRacks from './room-racks';

type Props = {
  roomId: string;
};

const RoomView = ({ roomId }: Props) => {
  const { data: racks, isError, isLoading } = useGetRacks(roomId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IsLoadingPage />
      </div>
    );
  }
  if (isError) {
    return <div className="h-full w-full">{/* <ManageRacks roomId={roomId} /> */}</div>;
  } else if (!racks?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyRacks roomId={roomId} />
      </div>
    );
  }
  return (
    <RoomRacks roomId={roomId} racks={racks} />
  );
};

export default RoomView;
