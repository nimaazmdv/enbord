import { HomeHeader } from "@/widgets/home-header";
import { HomeEmpty } from "@/widgets/home-empty";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col gap-4">
      <HomeHeader />
      <HomeEmpty />
    </div>
  );
}
