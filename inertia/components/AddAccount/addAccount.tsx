import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Plus } from 'lucide-react'
import Input from '~/components/CommonComponents/Input/input'
import { FormEvent } from 'react'

type AddAccountProps = {
  onSubmit: (e: FormEvent) => Promise<void>
}

export default function AddAccount({ onSubmit }: AddAccountProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogDescription>Add a new savings account to your portfolio</DialogDescription>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <Input name="accountName" id="accountName" label="Account Name" />
            <Input name="accountDescription" id="accountDescription" label="Account Description" />
            <Input name="initialBalance" id="initialBalance" type="number" label="Initial Balance" />
            <DialogFooter>
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
