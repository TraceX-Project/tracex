import React from 'react';

const PhysicalMapSkeleton = () => {
  return (
    <div className="relative h-full w-full animate-pulse">
      <div className="absolute inset-0 bg-gray-200" />
      <div className="absolute top-4 left-4 h-10 w-80 rounded-md bg-gray-300" />
      <div className="absolute bottom-4 left-4 h-32 w-48 rounded-md bg-gray-300" />
    </div>
  );
};

export default PhysicalMapSkeleton;
