import Bucket, { BucketDTO } from '#models/bucket'

export default class BucketsService {
  async GetAllBucketsForUser(userId: number): Promise<BucketDTO[]> {
    const buckets = await Bucket.query().select('buckets.*').where('user_id', userId)

    return buckets.map((a) => {
      const json = a.serialize()
      return {
        id: json.id,
        name: json.name,
        description: json.description,
        goalAmount: json.goalAmount,
      }
    })
  }
}
