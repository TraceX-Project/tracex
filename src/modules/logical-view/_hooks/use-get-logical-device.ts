import { QUERY_KEYS } from "@/shared/constants/query-key";
import { getQueryClient } from "@/shared/tanstack-query/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getLogicalDeviceById } from "../_services/devices.service";

export const useGetLogicalDevice = (id: string) => useQuery({
  queryKey: [QUERY_KEYS.logicalDevices, id],
  queryFn: () => getLogicalDeviceById(id),
  enabled: !!id,
});
