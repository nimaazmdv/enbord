import { SigninCard } from "@/features/auth";

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/auth/signin")({
  staticData: { access: "guest-only" },

  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),

  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh centered">
      <SigninCard />
    </div>
  );
}
