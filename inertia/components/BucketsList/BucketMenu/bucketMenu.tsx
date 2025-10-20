import {useState} from "react";
import { Popover } from '@radix-ui/themes'
import {DotsVerticalIcon} from "@radix-ui/react-icons";
import {Flex} from "@radix-ui/themes";

import ConfirmationModal from "~/components/CommonComponents/ConfirmationModal/confirmationModal";

import {BucketDTO} from "#models/bucket";
import {AllocationDTO, CreateAllocationDTO} from "#models/allocation";
import FormModal from "~/components/CommonComponents/FormModal/formModal";
import {createAllocationConfig} from "~/services/modal_config_service";
import {createAllocation} from "~/services/allocation_service";

type BucketMenuProps = {
  bucket: BucketDTO
  onDeleteConfirm: () => Promise<void>
  allocateFunds: (allocation: AllocationDTO) => void;
}

export default function BucketMenu({ allocateFunds, bucket, onDeleteConfirm }: BucketMenuProps) {
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
          <FormModal<CreateAllocationDTO> {...createAllocationConfig(addAllocation, [bucket], bucket.id.toString())}/>
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

  async function addAllocation(payload: CreateAllocationDTO) {
    const response: AllocationDTO = await createAllocation(payload);
    allocateFunds(response);
  }
}
