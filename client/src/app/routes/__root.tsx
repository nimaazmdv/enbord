import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "@/shared/stores/auth.store";

import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
  isAuthenticated?: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  staticData: { access: "public" },

  beforeLoad: ({ context, location, matches }) => {
    const route = matches.at(-1);
    const access = route?.staticData.access ?? "protected";
    const signedOut = useAuthStore.getState().signedOut;

    if (access === "protected" && !context.isAuthenticated) {
      throw redirect({
        to: "/auth/signin",
        search: { redirect: signedOut ? undefined : location.href },
        replace: true,
      });
    }

    if (access === "guest-only" && context.isAuthenticated) {
      throw redirect({
        to: "/app",
        replace: true,
      });
    }
  },

  component: () => <Outlet />,
});
