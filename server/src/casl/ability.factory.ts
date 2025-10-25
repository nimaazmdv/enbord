import { Injectable } from "@nestjs/common";
import { AbilityBuilder, PureAbility, subject } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import { MembershipsDomainService } from "src/memberships/memberships-domain.service";

import { User, Board, Item, Membership, Invitation, Role } from "@prisma/client";
import { SafeUser } from "src/common/decorators/current-user.decorator";
import { Action } from "src/common/constants/enums/action.enum";

type AppSubjects = Subjects<{
  User: User;
  Board: Board;
  Item: Item;
  Membership: Membership;
  Invitation: Invitation;
}>;
type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class AbilityFactory {
  constructor(private membershipsDomainService: MembershipsDomainService) {}

  async createFor(user: SafeUser, boardId?: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    const membership = boardId
      ? await this.membershipsDomainService.findOne(boardId, user.id)
      : null;

    // Users can manage their own boards and respond to invitations
    can(Action.Manage, "Board", { ownerId: user.id });
    can(Action.Respond, "Invitation", { receiverId: user.id });

    if (membership) {
      const { role } = membership;

      // All members can read the board info and its items and members
      can(Action.Read, "Board", { id: boardId });
      can(Action.Read, "Item", { boardId });
      can(Action.Read, "Membership", { boardId });

      can(Action.Leave, "Board", { id: boardId });

      if (role === "OWNER" || role === "MANAGER") {
        can(Action.Manage, "Board", { id: boardId });
        can(Action.Manage, "Item", { boardId });

        can(Action.Manage, "Invitation", { boardId });
        cannot(Action.Delete, "Invitation", { status: "PENDING" });
      }

      if (role === "OWNER") {
        // Owners can manage members but cannot update or delete themselves
        can(Action.Manage, "Membership", { boardId });
        cannot([Action.Update, Action.Delete], "Membership", { memberId: user.id });

        // Owners cannot leave the board
        cannot(Action.Leave, "Board", { id: boardId });
      }

      if (role === "MANAGER") {
        // Managers cannot delete the board
        cannot(Action.Delete, "Board", { id: boardId });

        // Managers can only remove members
        can(Action.Delete, "Membership", { boardId, role: "MEMBER" });
      }
    }

    return build();
  }
}

// Re-export for easier imports
export { Action, subject };
