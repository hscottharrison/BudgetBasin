import { BucketDTO, CreateBucketDTO } from '#models/bucket'

export async function createBucket(payload: CreateBucketDTO): Promise<BucketDTO> {
  try {
    const response = await fetch('/api/buckets', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}
