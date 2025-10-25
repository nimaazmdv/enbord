import { Controller, Delete, Get } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CurrentUser, SafeUser } from "src/common/decorators/current-user.decorator";

@Controller("notifications")
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser() user: SafeUser) {
    return this.notificationsService.findAll(user);
  }

  @Delete()
  async removeAll(@CurrentUser() user: SafeUser) {
    return this.notificationsService.removeAll(user);
  }
}
