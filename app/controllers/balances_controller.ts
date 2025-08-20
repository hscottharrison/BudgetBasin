import type { HttpContext } from '@adonisjs/core/http'
import Balance from '#models/balance'

export default class BalancesController {
  async create({ request, response }: HttpContext) {
    try {
      const data = request.all();
      const balance = await Balance.create(data)
      response.json(balance)
    } catch (error) {
      return response.internalServerError(error.message)
    }
  }
}
