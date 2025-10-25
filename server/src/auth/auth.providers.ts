import { Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./guards/auth.guard";

export const AuthProviders: Provider[] = [{ provide: APP_GUARD, useClass: AuthGuard }];
