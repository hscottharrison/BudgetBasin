import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ auth, request, response }: HttpContext) {
    try {
      const data = request.all()
      console.log(data)
      const user = await User.create(data)
      await auth.use('web').login(user)
      response.redirect().toPath('/user-home')
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  async login({ request, auth, response }: HttpContext) {
    try {
      console.log('hit /api/login', request.body())
      const { email, password } = request.body()
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      response.redirect().toPath('/user-home')
    } catch (error) {
      return response.status(400).send(error.message)
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
