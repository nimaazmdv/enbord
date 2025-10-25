import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { NotificationsDomainService } from "./notifications-domain.service";

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsDomainService],
  exports: [NotificationsDomainService],
})
export class NotificationsModule {}
