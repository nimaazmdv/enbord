import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  staticData: { access: "guest-only" },
  component: () => <Navigate to="/auth/signin" replace />,
});
