import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { FindAllUsersQueryDto } from "./dto/find-all-users-query.dto";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get("boards/:boardId/items")
  async findAll(
    @Param("boardId") boardId: string,
    @Query() query: FindAllUsersQueryDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.itemsService.findAll(boardId, query.cursor, user);
  }

  @Get("items/:id")
  async findOne(@Param("id") id: string, @CurrentUser() user: SafeUser) {
    return this.itemsService.findOne(id, user);
  }

  @Delete("items/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @CurrentUser() user: SafeUser) {
    return this.itemsService.remove(id, user);
  }
}
