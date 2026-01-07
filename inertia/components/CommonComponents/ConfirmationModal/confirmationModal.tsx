import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import LoadingButton from '~/components/CommonComponents/LoadingButton/loadingButton'

type DeleteAccountProps = {
  title: string
  buttonText?: string
  buttonVariant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link'
  description: string
  onConfirm: () => Promise<void>
}

export default function ConfirmationModal({
  title,
  description,
  onConfirm,
  buttonText = '',
  buttonVariant = 'default',
}: DeleteAccountProps) {
  const [open, setOpen] = useState<boolean>(false)

  async function onConfirmClick() {
    await onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Trash2 className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton type="button" cb={onConfirmClick} label="Delete" variant="destructive" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
