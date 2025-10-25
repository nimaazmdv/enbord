import { Controller, Get, Query } from "@nestjs/common";
import { AbilityFactory } from "./ability.factory";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";

@Controller("/ability")
export class AbilityController {
  constructor(private abilityFactory: AbilityFactory) {}

  @Get()
  async findAbility(@CurrentUser() user: SafeUser, @Query("boardId") boardId?: string) {
    const ability = await this.abilityFactory.createFor(user, boardId);

    return { rules: ability.rules };
  }
}
