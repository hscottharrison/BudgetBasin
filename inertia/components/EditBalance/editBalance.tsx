import {FormEvent} from "react";
import {Button, Dialog, Flex, IconButton} from "@radix-ui/themes";
import {Pencil1Icon} from "@radix-ui/react-icons";

import Input from "~/components/CommonComponents/Input/input";

import {BankAccountDTO} from "#models/bank_account";

type EditBalanceProps = {
  onSubmit: (balance: string, id: number) => Promise<void>;
  metadata: BankAccountDTO
}

export default function EditBalance({ onSubmit, metadata }: EditBalanceProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton>
          <Pencil1Icon></Pencil1Icon>
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit Balance</Dialog.Title>
        <Dialog.Description>Update your account's balance</Dialog.Description>
        <form onSubmit={submit}>
          <Flex direction='column' gap='4'>
            <Input
              name='balance'
              label='New Balance'
              type='number'/>
          </Flex>
          <Flex gap='4' justify='end'>
            <Dialog.Close>
              <Button type='button' variant='surface'>Cancel</Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button type='submit'>Update</Button>
            </Dialog.Close>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const balance = document.getElementById('balance') as HTMLInputElement;
    onSubmit(balance.value, metadata.id)
  }
}
