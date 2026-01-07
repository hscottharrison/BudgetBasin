import { useState } from 'react'
import { MoreVertical, Minus } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import ConfirmationModal from '~/components/CommonComponents/ConfirmationModal/confirmationModal'

import { BucketDTO } from '#models/bucket'
import { TransactionDTO, CreateTransactionDTO } from '#models/transaction'
import FormModal from '~/components/CommonComponents/FormModal/formModal'
import { createAllocationConfig, createSpendConfig } from '~/services/modal_config_service'
import { createTransaction } from '~/services/transaction_service'
import { useUserHome } from '~/context/UserHomeContext'
import { TransactionTypes } from '~/types/enums'

type BucketMenuProps = {
  bucket: BucketDTO
  onDeleteConfirm: () => Promise<void>
  allocateFunds: (allocation: TransactionDTO) => void
}

export default function BucketMenu({ allocateFunds, bucket, onDeleteConfirm }: BucketMenuProps) {
  /**
   * CONTEXT
   */
  const { transactionTypes } = useUserHome()
  /**
   * STATE
   */
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="flex flex-col gap-2">
          <FormModal<CreateTransactionDTO>
            {...createAllocationConfig(addAllocation, [bucket], bucket.id.toString())}
          />
          <FormModal<CreateTransactionDTO>
            {...createSpendConfig(addSpend, [bucket], bucket.id.toString())}
            actionLabelIcon={<Minus className="h-4 w-4" />}
          />
          <ConfirmationModal
            title="Delete Bucket"
            buttonText="Delete Bucket"
            buttonVariant="outline"
            description={`Are you sure you want to delete this bucket, ${bucket.name}, and all related allocations`}
            onConfirm={deleteBucket}
          />
        </div>
      </PopoverContent>
    </Popover>
  )

  async function deleteBucket() {
    await onDeleteConfirm()
    setOpen(false)
  }

  async function addAllocation(payload: CreateTransactionDTO) {
    const type = transactionTypes.find((type) => type.value === TransactionTypes.ALLOCATION)
    payload.transactionTypeId = type?.id ?? 0
    const response: TransactionDTO = await createTransaction(payload)
    allocateFunds(response)
  }

  async function addSpend(payload: CreateTransactionDTO) {
    const type = transactionTypes.find((type) => type.value === TransactionTypes.SPEND)
    payload.transactionTypeId = type?.id ?? 0
    const response: TransactionDTO = await createTransaction(payload)
    allocateFunds(response)
  }
}
