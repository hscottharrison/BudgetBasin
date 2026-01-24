import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth_validator'

export default class AuthController {
  async register({ auth, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const user = await User.create(data)
      await auth.use('web').login(user)
      response.redirect().toPath('/user-home')
    } catch (error) {
      return response.status(error.status ?? 422).send({
        code: error.code,
        message: error.message,
        errors: error.messages ?? undefined,
      })
    }
  }

  async login({ request, auth, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      response.redirect().toPath('/user-home')
    } catch (error) {
      return response.status(error.status ?? 500).send({
        code: error.code,
        message: error.message,
        errors: error.messages ?? undefined,
      })
    }
  }

  async logout({ session, auth, response }: HttpContext) {
    await auth.use('web').logout()
    session.flash('notification', {
      type: 'success',
      message: 'Logout successful',
    })
    response.redirect().toPath('/login')
  }
}
