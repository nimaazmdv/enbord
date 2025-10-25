import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { ACCESS_TOKEN_SERVICE } from "src/common/constants/di.constants";
import { REFRESH_TOKEN_SERVICE } from "src/common/constants/di.constants";

export const JwtProviders: Provider[] = [
  {
    provide: ACCESS_TOKEN_SERVICE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      new JwtService({
        secret: configService.getOrThrow("ACCESS_TOKEN_SECRET"),
        signOptions: { expiresIn: configService.getOrThrow("ACCESS_TOKEN_EXPIRES_IN_MIN") + "m" },
      }),
  },
  {
    provide: REFRESH_TOKEN_SERVICE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      new JwtService({
        secret: configService.getOrThrow("REFRESH_TOKEN_SECRET"),
        signOptions: { expiresIn: configService.getOrThrow("REFRESH_TOKEN_EXPIRES_IN_DAY") + "d" },
      }),
  },
];
