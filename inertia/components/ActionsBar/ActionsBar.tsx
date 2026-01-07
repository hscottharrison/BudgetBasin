import AddAccount from '~/components/AddAccount/addAccount'
import FormModal, { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'

import { createBucket } from '~/services/bucket_service'
import { createTransaction } from '~/services/transaction_service'
import { createAccount } from '~/services/account_service'

import { BankAccountDTO } from '#models/bank_account'
import { BucketDTO, CreateBucketDTO } from '#models/bucket'
import { TransactionDTO, CreateTransactionDTO } from '#models/transaction'
import { createAllocationConfig } from '~/services/modal_config_service'
import { useUserHome } from '~/context/UserHomeContext'

export default function ActionsBar() {
  const { updateAccounts, addBucket, updateTransactionsForBucket, buckets } = useUserHome()
  return (
    <div className="overflow-x-auto w-full pb-4">
      <div className="flex gap-2">
        <AddAccount onSubmit={addAccount} />
        <FormModal<CreateBucketDTO> {...getCreateBucketConfig()} />
        <FormModal<CreateTransactionDTO> {...createAllocationConfig(addTransaction, buckets)} />
      </div>
    </div>
  )
  async function addAccount(e: React.FormEvent) {
    e.preventDefault()

    const accountName = document.getElementById('accountName') as HTMLInputElement
    const accountDescription = document.getElementById('accountDescription') as HTMLInputElement
    const initialBalance = document.getElementById('initialBalance') as HTMLInputElement

    const payload = {
      accountName: accountName.value,
      accountDescription: accountDescription.value,
      initialBalance: initialBalance.value,
    }
    const response: BankAccountDTO[] = await createAccount(payload)
    updateAccounts(response)
  }

  async function add(payload: CreateBucketDTO) {
    const response: BucketDTO = await createBucket(payload)
    addBucket(response)
  }

  async function addTransaction(payload: CreateTransactionDTO) {
    const response: TransactionDTO = await createTransaction(payload)
    updateTransactionsForBucket(response)
  }

  function getCreateBucketConfig(): FormModalProps<CreateBucketDTO> {
    return {
      actionLabel: 'Add Bucket',
      title: 'Create New Bucket',
      description: 'Create a new bucket or savings goal to allocate your funds',
      submitButtonLabel: 'Create',
      onSubmit: add,
      formElements: [
        {
          name: 'name',
          label: 'Bucket Name',
        },
        {
          name: 'description',
          label: 'Bucket Description',
        },
        {
          name: 'goalAmount',
          label: 'Goal Amount',
          type: 'number',
          step: '0.01',
        },
      ],
    }
  }
}
