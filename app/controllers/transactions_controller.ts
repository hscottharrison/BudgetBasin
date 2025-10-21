import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { inject } from '@adonisjs/core'

@inject()
export default class TransactionsController {
  constructor() {}
  async create({ auth, request, response }: HttpContext): Promise<void> {
    try {
      const data = request.all()
      const transactionData = {
        userId: auth?.user?.id,
        bucketId: Number(data.bucketId),
        transactionTypeId: Number(data.transactionTypeId),
        amount: Number(data.amount),
      }
      const transaction = await Transaction.create(transactionData)
      response.json(transaction)
    } catch (error) {
      response.internalServerError(error.message)
    }
  }
}
