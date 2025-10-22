import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import TransactionType from '#models/transaction_type'

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
      const transactionType = await TransactionType.findOrFail(transaction.transactionTypeId)
      const transactionJson = transaction.serialize()
      const transactionTypeJson = transactionType.serialize()
      const res = {
        ...transactionJson,
        transactionType: transactionTypeJson,
      }
      response.json(res)
    } catch (error) {
      response.internalServerError(error.message)
    }
  }
}
