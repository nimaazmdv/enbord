import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

export function HomeHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <div className="flex items-center gap-2">
          {!isMobile && <div className="text-xl">📌</div>}
          <div>
            <h1>Home</h1>
            <p className="text-muted-foreground text-sm">0 items</p>
          </div>
        </div>
      </div>

      <Button variant="ghost" size="icon-sm">
        <MoreVerticalIcon className="size-5" />
      </Button>
    </header>
  );
}
