import { QUERY_KEYS } from "@/shared/constants/query-key";
import { getQueryClient } from "@/shared/tanstack-query/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { createRack } from "../_services/room.service";
import { CreateRackRequest } from "../_types/room";

export const useCreateRack = () => {
    const queryClient =  getQueryClient();

    return useMutation({
        mutationFn: async({roomId,data}: {roomId: string, data: CreateRackRequest}) => createRack(data),
        onSuccess: ({roomId}) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.rooms, roomId] });
        },
    });
}