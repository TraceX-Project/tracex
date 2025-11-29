'use client';

import React, { useEffect } from 'react';

import { useMediaQuery } from '../hooks/use-media-query';
import { useBoolean } from '../hooks/use-boolean';

type Props = {
  children?: React.ReactNode;
};

const ScreenGuard = ({ children }: Props) => {
  const { value: mounted, setValue: setMounted } = useBoolean(false);
  const isTabletOrAbove = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isTabletOrAbove) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-6 text-center">
        <p className="text-lg font-medium">
          This website is available only on tablets or computers.
          <br />
          Please open this site on a larger device.
        </p>
      </div>
    );
  }
  return <>{children}</>;
};

export default ScreenGuard;
