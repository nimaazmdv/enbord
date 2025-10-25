import { Global, Module } from "@nestjs/common";
import { MembershipsModule } from "src/memberships/memberships.module";
import { AbilityController } from "./ability.controller";
import { AbilityFactory } from "./ability.factory";

@Global()
@Module({
  imports: [MembershipsModule],
  controllers: [AbilityController],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class CaslModule {}
