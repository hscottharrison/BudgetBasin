import { Popover } from '@radix-ui/themes'
import {DotsVerticalIcon} from "@radix-ui/react-icons";
import {Flex} from "@radix-ui/themes";
import {BucketDTO} from "#models/bucket";
import ConfirmationModal from "~/components/CommonComponents/ConfirmationModal/confirmationModal";
import {useState} from "react";

type BucketMenuProps = {
  bucket: BucketDTO
  onDeleteConfirm: () => Promise<void>
}

export default function BucketMenu({ bucket, onDeleteConfirm }: BucketMenuProps) {
  const [open, setOpen] = useState<boolean>(false);

  async function deleteBucket() {
    await onDeleteConfirm();
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <DotsVerticalIcon />
      </Popover.Trigger>
      <Popover.Content size='2'>
        <Flex direction="column">
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
}
