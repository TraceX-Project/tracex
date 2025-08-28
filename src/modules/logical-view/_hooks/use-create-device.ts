// import { createDevice } from '../_services/logicalview.service';

// export const useCreateDevice = () => {
//   const queryClient = getQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateDeviceRequest) => createDevice(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.devices] });
//     },
//   });
// };
