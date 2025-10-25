import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";

@Controller("boards")
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  async create(@Body() dto: CreateBoardDto, @CurrentUser() user: SafeUser) {
    return this.boardsService.create(dto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: SafeUser) {
    return this.boardsService.findAll(user);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @CurrentUser() user: SafeUser) {
    return this.boardsService.findOne(id, user);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateBoardDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.boardsService.update(id, dto, user);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @CurrentUser() user: SafeUser) {
    return this.boardsService.remove(id, user);
  }
}
