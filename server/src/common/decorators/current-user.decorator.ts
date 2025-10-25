import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const currentUser = request.currentUser;

  return data ? currentUser?.[data] : currentUser;
});
