import type { HttpContext } from '@adonisjs/core/http'
import Allocation from '#models/allocation'

export default class AllocationsController {
  async create({ auth, request, response }: HttpContext): Promise<void> {
    try {
      const data = request.all()
      const allocationData = {
        userId: auth?.user?.id,
        bucketId: Number(data.bucketId),
        amount: Number(data.amount),
      }
      const allocation = await Allocation.create(allocationData)
      response.json(allocation)
    } catch (error) {
      response.internalServerError(error.message)
    }
  }
}
