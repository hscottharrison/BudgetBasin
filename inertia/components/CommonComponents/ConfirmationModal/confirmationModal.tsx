import {Button, Dialog, Flex} from '@radix-ui/themes'
import {TrashIcon} from "@radix-ui/react-icons";
import {useState} from "react";
import LoadingButton from '~/components/CommonComponents/LoadingButton/loadingButton'

type DeleteAccountProps = {
  title: string
  buttonText?: string
  buttonVariant?: 'surface' | 'solid' | 'outline' | 'ghost'
  description: string
  onConfirm: () => Promise<void>
}

export default function ConfirmationModal({ title, description, onConfirm, buttonText = '', buttonVariant = 'solid' }: DeleteAccountProps) {
  const [open, setOpen] = useState<boolean>(false)

  async function onConfirmClick() {
    await onConfirm()
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant={buttonVariant}>
          <TrashIcon />
          {buttonText}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Flex gap='4' justify='end'>
          <Dialog.Close>
            <Button type='button' variant='surface'>Cancel</Button>
          </Dialog.Close>
          <LoadingButton type='button' cb={onConfirmClick} label='Delete' />
          {/*<Button type='button' onClick={onConfirmClick}>Delete</Button>*/}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
