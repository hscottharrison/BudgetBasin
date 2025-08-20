// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import Bucket from '#models/bucket'

export default class BucketsController {
  async create({ auth, request, response }: HttpContext) {
    try {
      const data = request.all()
      const bucketData = {
        userId: auth?.user?.id,
        ...data,
      }
      const bucket = await Bucket.create(bucketData)
      return response.json(bucket)
    } catch (error) {
      return response.internalServerError(error.message)
    }
  }
}
