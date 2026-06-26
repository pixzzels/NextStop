import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { tripQueryKeys } from "./tripQueries";
import type { CreateTripInput, Trip } from "./tripTypes";

function normalizeCreateTripInput(input: CreateTripInput) {
  return {
    trip_title: input.title.trim(),
    trip_destination: input.destination.trim(),
    trip_start_date: input.startDate,
    trip_end_date: input.endDate,
    trip_description: input.description?.trim() ?? null,
    trip_timezone: input.timezone?.trim() || "UTC",
  };
}

export function useCreateTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTripInput): Promise<Trip> => {
      const normalizedInput = normalizeCreateTripInput(input);

      const { data, error } = await supabase.rpc(
        "create_trip_with_owner",
        normalizedInput,
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Trip was not created.");
      }

      return data as Trip;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: tripQueryKeys.lists(),
      });
    },
  });
}