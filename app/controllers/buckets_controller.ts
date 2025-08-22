import { HttpContext } from '@adonisjs/core/http'
import BucketsService from '#services/buckets_service'
import { inject } from '@adonisjs/core'
import Bucket from '#models/bucket'

@inject()
export default class BucketsController {
  constructor(private bucketsService: BucketsService) {}
  async create({ auth, request, response }: HttpContext) {
    try {
      const data = request.all()
      const bucketData = {
        userId: auth?.user?.id,
        description: data.description,
        name: data.name,
        goalAmount: data.goalAmount,
      }
      const bucket = await this.bucketsService.createBucket(bucketData)
      return response.json(bucket)
    } catch (error) {
      return response.internalServerError(error.message)
    }
  }

  async delete({ auth, params, response }: HttpContext) {
    try {
      const bucket = await Bucket.findOrFail(params.id)
      await bucket.delete()
      const buckets = await this.bucketsService.GetAllBucketsForUser(auth?.user?.id ?? 0)
      response.json(buckets)
    } catch (error) {
      response.internalServerError(error.message)
    }
  }
}
