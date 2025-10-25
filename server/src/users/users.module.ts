import { Module } from "@nestjs/common";
import { UsersDomainService } from "./users-domain.service";

@Module({
  providers: [UsersDomainService],
  exports: [UsersDomainService],
})
export class UsersModule {}
