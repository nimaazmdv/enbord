import { Link, type LinkProps } from "@tanstack/react-router";
import { FileIcon } from "lucide-react";

import type { Board } from "@/shared/types/entity.types";

interface BoardLinkProps extends LinkProps {
  board: Board;
}

export function BoardLink({ board, ...props }: BoardLinkProps) {
  return (
    <Link {...props} to="/app/boards/$boardId" params={{ boardId: board.id }}>
      {board.icon ? <span>{board.icon}</span> : <FileIcon />}
      <span>{board.name}</span>
    </Link>
  );
}
