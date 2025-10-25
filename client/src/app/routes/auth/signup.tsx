import { SignupCard } from "@/features/auth";

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/auth/signup")({
  staticData: { access: "guest-only" },

  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),

  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh centered">
      <SignupCard />
    </div>
  );
}
