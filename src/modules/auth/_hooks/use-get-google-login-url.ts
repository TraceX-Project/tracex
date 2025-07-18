import { useMutation } from '@tanstack/react-query';
import { getGoogleLoginUrl } from '../_service/auth.service';

export const useGetGoogleLoginUrl = () =>
  useMutation({
    mutationFn: getGoogleLoginUrl,
  });
