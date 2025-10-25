import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/app-ui/loader";

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  staticData: { access: "public" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="centered min-h-svh text-center">
      <div className="space-y-2">
        <Loader />
        <div>
          <h1 className="text-xl font-bold">Landing page</h1>
          <p>This page is under construction</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/auth/signin">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
