import {Button, Dialog, Flex} from "@radix-ui/themes";
import {PlusIcon} from "@radix-ui/react-icons";
import Input from "~/components/CommonComponents/Input/input";
import {FormEvent} from "react";

type AddAccountProps = {
  onSubmit: (e: FormEvent) => Promise<void>;
}

export default function AddAccount({ onSubmit }: AddAccountProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button radius='full'>
          <PlusIcon />
          Add Account
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Add New Account</Dialog.Title>
        <Dialog.Description>Add a new savings account to your portfolio</Dialog.Description>
        <form onSubmit={onSubmit}>
          <Flex direction='column' gap='4'>
            <Input
              name='accountName'
              label="Account Name"/>
            <Input
              name='accountDescription'
              label="Account Description"/>
            <Input
              name='initialBalance'
              type='number'
              label="Initial Balance"/>
            <Flex gap='4' justify='end'>
              <Dialog.Close>
                <Button type='button' variant='surface'>Cancel</Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button type='submit'>Create</Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
