import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { MembershipsService } from "./memberships.service";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";

@Controller("boards/:boardId/members")
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Get()
  async findAll(@Param("boardId") boardId: string, @CurrentUser() user: SafeUser) {
    return this.membershipsService.findAll(boardId, user);
  }

  @Get(":memberId")
  async findOne(
    @Param("boardId") boardId: string,
    @Param("memberId") memberId: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.membershipsService.findOne(boardId, memberId, user);
  }

  @Patch(":memberId")
  async update(
    @Param("boardId") boardId: string,
    @Param("memberId") memberId: string,
    @Body() dto: UpdateMemberDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.membershipsService.update(boardId, memberId, dto, user);
  }

  @Delete("me")
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(@Param("boardId") boardId: string, @CurrentUser() user: SafeUser) {
    return this.membershipsService.leave(boardId, user);
  }

  @Delete(":memberId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param("boardId") boardId: string,
    @Param("memberId") memberId: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.membershipsService.remove(boardId, memberId, user);
  }
}
