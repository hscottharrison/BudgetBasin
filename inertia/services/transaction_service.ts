import { CreateTransactionDTO } from '#models/transaction'

export async function createTransaction(payload: CreateTransactionDTO): Promise<any> {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return response.json()
}
