import {useState} from "react";
import { Popover } from '@radix-ui/themes'
import {DotsVerticalIcon} from "@radix-ui/react-icons";
import {Flex} from "@radix-ui/themes";

import ConfirmationModal from "~/components/CommonComponents/ConfirmationModal/confirmationModal";

import {BucketDTO} from "#models/bucket";
import {TransactionDTO, CreateTransactionDTO} from "#models/transaction";
import FormModal from "~/components/CommonComponents/FormModal/formModal";
import {createAllocationConfig} from "~/services/modal_config_service";
import {createTransaction} from "~/services/transaction_service";
import {useUserHome} from "~/context/UserHomeContext";
import {TransactionTypes} from "#models/transaction_type";

type BucketMenuProps = {
  bucket: BucketDTO
  onDeleteConfirm: () => Promise<void>
  allocateFunds: (allocation: TransactionDTO) => void;
}

export default function BucketMenu({ allocateFunds, bucket, onDeleteConfirm }: BucketMenuProps) {
  /**
   * CONTEXT
   */
  const { transactionTypes } = useUserHome();
  /**
   * STATE
   */
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <DotsVerticalIcon />
      </Popover.Trigger>
      <Popover.Content size='2'>
        <Flex direction="column" gap='2'>
          <FormModal<CreateTransactionDTO> {...createAllocationConfig(addAllocation, [bucket], bucket.id.toString())}/>
          {/*<FormModal<CreateTransactionDTO> {...createSpendConfig(addSpend, [bucket], bucket.id.toString())}/>*/}
          <ConfirmationModal
          title='Delete Bucket'
          buttonText='Delete Bucket'
          buttonVariant='surface'
          description={`Are you sure you want to delete this bucket, ${bucket.name}, and all related allocations`}
          onConfirm={deleteBucket} />
        </Flex>
      </Popover.Content>
    </Popover.Root>
  )

  async function deleteBucket() {
    await onDeleteConfirm();
    setOpen(false);
  }

  async function addAllocation(payload: CreateTransactionDTO) {
    const type = transactionTypes.find((type) => type.value === TransactionTypes.ALLOCATION);
    payload.transactionTypeId = type?.id ?? 0;
    const response: TransactionDTO = await createTransaction(payload);
    allocateFunds(response);
  }

  // async function addSpend(payload: CreateTransactionDTO) {
  //   const type = transactionTypes.find((type) => type.value === TransactionTypes.SPEND);
  //   payload.transactionTypeId = type?.id ?? 0;
  //   const response: TransactionDTO = await createTransaction(payload);
  //   allocateFunds(response);
  // }
}
