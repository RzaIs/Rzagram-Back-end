import { createParamDecorator, ExecutionContext } from "@nestjs/common"

function factory<T>(data: string | undefined, context: ExecutionContext): T {
  const request = context.switchToHttp().getRequest()
  if (data) {
    return request.user[data]
  } else {
    return request.user
  }
}

export const GetUser = createParamDecorator(factory)
