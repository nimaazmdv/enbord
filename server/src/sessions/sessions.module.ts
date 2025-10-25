import { Module } from "@nestjs/common";
import { JwtProviders } from "src/common/providers/jwt.providers";
import { SessionsDomainService } from "./sessions-domain.service";

@Module({
  providers: [SessionsDomainService, ...JwtProviders],
  exports: [SessionsDomainService],
})
export class SessionsModule {}
