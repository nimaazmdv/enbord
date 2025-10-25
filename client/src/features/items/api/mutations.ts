import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

export function useِDeleteItemMutation() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.delete(`/items/${id}`).then((res) => res.data),

    onSuccess: () => {
      // Rely on realtime handlers
    },
  });
}
