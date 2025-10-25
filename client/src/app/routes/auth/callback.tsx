import { Loader } from "@/shared/components/app-ui/loader";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { api } from "@/shared/api/client";
import { useAuthStore } from "@/shared/stores/auth.store";

export const Route = createFileRoute("/auth/callback")({
  staticData: { access: "guest-only" },

  validateSearch: z.object({
    token: z.string().optional().catch(""),
  }),

  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { token } = Route.useSearch();

  const signin = useAuthStore((state) => state.signin);

  useEffect(() => {
    if (!token) {
      navigate({ to: "/auth/signin" });
      return;
    }

    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        signin(token, res.data.user);
        navigate({ to: "/app" });
      })
      .catch(() => navigate({ to: "/auth/signin" }));
  }, [token, signin, navigate]);

  return (
    <div className="centered min-h-svh">
      <Loader />
    </div>
  );
}
