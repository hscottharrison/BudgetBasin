import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class ViewsController {
  async home({ inertia }: HttpContext) {
    return inertia.render('home')
  }

  async login({ inertia }: HttpContext) {
    return inertia.render('Login/login')
  }

  async register({ inertia }: HttpContext) {
    return inertia.render('Register/register')
  }

  async userHome({ inertia, auth }: HttpContext) {
    const dto = {
      user: {
        firstName: auth?.user?.firstName || '',
        lastName: auth?.user?.lastName || '',
      },
    }

    return inertia.render('UserHome/userHome', dto)
  }
}
