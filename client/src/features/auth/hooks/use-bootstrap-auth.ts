import { useEffect } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useRefreshMutation } from "../api/mutations";

export function useBootstrapAuth() {
  const token = useAuthStore((state) => state.token);
  const { mutate: refresh, isIdle, isPending } = useRefreshMutation();

  useEffect(() => {
    if (!token) refresh();
  }, [token, refresh]);

  return {
    isReady: !isIdle && !isPending,
    isAuthenticated: !!token,
  };
}
