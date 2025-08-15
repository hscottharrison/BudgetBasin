import type { HttpContext } from '@adonisjs/core/http'
import { BaseDTO } from '#models/base_dto' // if you use path aliases; otherwise use relative import
import { Data } from '@adonisjs/inertia/types'

export default class InertiaShareMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const user = ctx.auth?.use('web')?.user

    const shared: BaseDTO = {
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
          }
        : null,
    }

    // @ts-ignore
    ctx.inertia.share(shared satisfies Record<string, Data>)
    await next()
  }
}
