'use client';

import { Button } from '@/shared/components/ui/button';
import React from 'react';
import { useGetGoogleLoginUrl } from './_hooks/use-get-google-login-url';

const GoogleLoginBtn = () => {
  const { mutateAsync: getGoogleLoginUrl } = useGetGoogleLoginUrl();

  const handleGoogleLogin = async () => {
    const { url } = await getGoogleLoginUrl();

    window.location.replace(url);
  };

  return <Button onClick={handleGoogleLogin}>Google Login</Button>;
};

export default GoogleLoginBtn;
