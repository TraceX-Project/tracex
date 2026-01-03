'use client';

import React from 'react'
import { useGetRacks } from './_hooks/use-get-racks'
import EmptyRacks from './empty-racks';
import IsLoadingPage from '../../shared/components/is-loading';
import ManageRacks from './manage-racks';


type Props = {
  roomId: string
}

const RoomView = ({ roomId }: Props) => {
  const { data: racks, isError,isLoading } = useGetRacks(roomId);

  if (isLoading){
    return (
    <div className='flex h-full w-full items-center justify-center'>
        <IsLoadingPage/>
    </div>);
  }
  if (isError) {
    return (
    <div className='w-full h-full'>
      <ManageRacks roomId={roomId} />
    </div>);
  }
  else if (!racks?.length) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <EmptyRacks roomId={roomId} />
      </div>
    )
  }
  return (
    <div>{roomId}</div>
  )
}

export default RoomView