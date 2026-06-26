import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Trip } from "./tripTypes";

export const tripQueryKeys = {
  all: ["trips"] as const,
  lists: () => [...tripQueryKeys.all, "list"] as const,
};

export function useTripsQuery() {
  return useQuery({
    queryKey: tripQueryKeys.lists(),
    queryFn: async (): Promise<Trip[]> => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .is("deleted_at", null)
        .order("start_date", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    },
  });
}