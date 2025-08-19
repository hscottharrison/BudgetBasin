import {Button, Dialog, Flex, IconButton} from '@radix-ui/themes'
import {TrashIcon} from "@radix-ui/react-icons";

type DeleteAccountProps = {
  title: string
  description: string
  onConfirm: () => unknown
}

export default function ConfirmationModal({ title, description, onConfirm }: DeleteAccountProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton>
          <TrashIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Flex gap='4' justify='end'>
          <Dialog.Close>
            <Button type='button' variant='surface'>Cancel</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button type='button' onClick={onConfirm}>Delete</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
