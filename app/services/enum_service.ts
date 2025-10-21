import TransactionType, { TransactionTypeDTO } from '#models/transaction_type'

export default class EnumService {
  async GetTransactionTypes(): Promise<TransactionTypeDTO[]> {
    const types = await TransactionType.all()
    return types.map((t) => {
      const json = t.serialize()
      return {
        id: json.id,
        value: json.value,
        label: json.label
      }
    })
  }
}
