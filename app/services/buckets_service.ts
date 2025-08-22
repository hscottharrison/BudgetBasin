import Bucket, { BucketDTO, CreateBucketDTO } from '#models/bucket'

export default class BucketsService {
  async GetAllBucketsForUser(userId: number): Promise<BucketDTO[]> {
    const buckets = await Bucket.query()
      .preload('allocations')
      .select('buckets.*')
      .where('user_id', userId)

    return buckets.map((a) => {
      const json = a.serialize()
      return {
        id: json.id,
        name: json.name,
        description: json.description,
        allocations: json.allocations ?? [],
        goalAmount: json.goalAmount,
      }
    })
  }

  async createBucket(bucketData: CreateBucketDTO): Promise<BucketDTO> {
    const bucket = await Bucket.create(bucketData)
    const json = bucket.serialize()
    return {
      id: json.id,
      name: json.name,
      description: json.description,
      allocations: [],
      goalAmount: Number(json.goalAmount),
    }
  }
}
