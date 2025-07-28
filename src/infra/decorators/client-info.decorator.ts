import { IClientInfo } from '@/domain/interfaces/client-info.interface';
import { CustomRequest } from '@/domain/interfaces/custom-request.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IClientInfo => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    return request.clientInfo || {};
  },
);
