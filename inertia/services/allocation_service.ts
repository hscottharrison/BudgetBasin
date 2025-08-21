import { CreateAllocationDTO } from '#models/allocation'

export async function createAllocation(payload: CreateAllocationDTO): Promise<any> {
  const response = await fetch('/api/allocations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return response.json()
}
