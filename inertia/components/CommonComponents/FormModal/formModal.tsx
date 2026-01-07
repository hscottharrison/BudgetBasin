import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import Input from '~/components/CommonComponents/Input/input'
import { FormEvent, ReactNode, useState } from 'react'
import SelectInput from '~/components/CommonComponents/Select/select'
import { useLoading } from '~/context/LoadingContext'
import LoadingButton from '~/components/CommonComponents/LoadingButton/loadingButton'
import { PlusIcon } from 'lucide-react'

type FieldConfig<K extends string> = {
  name: K
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'type'>
  render?: (name: K) => ReactNode
  options?: { label: string; value: string }[]
  value?: string
  disabled?: boolean
  step?: string
}

export type FormModalProps<T extends Record<string, unknown>> = {
  actionLabel?: string
  actionLabelIcon?: React.ReactNode
  title: string
  description: string
  formElements: FieldConfig<Extract<keyof T, string>>[]
  closeButtonLabel?: string
  submitButtonLabel?: string
  onSubmit: (payload: T) => Promise<void>
}

export default function FormModal<T extends Record<string, unknown>>({
  actionLabel,
  actionLabelIcon,
  title,
  description,
  formElements,
  closeButtonLabel = 'Cancel',
  submitButtonLabel = 'Submit',
  onSubmit,
}: FormModalProps<T>) {
  const [open, setOpen] = useState(false)
  const { isLoading } = useLoading()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const payload = formElements.reduce((acc, f) => {
      const raw = fd.get(f.name)
      return { ...acc, [f.name]: raw }
    }, {} as T)

    await onSubmit(payload)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          {actionLabelIcon ?? <PlusIcon className="h-4 w-4" />}
          {actionLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="flex flex-col gap-4">
            {formElements.map((formElement) => {
              switch (formElement.type) {
                case 'select':
                  if (!!formElement.options) {
                    return (
                      <SelectInput
                        key={formElement.name}
                        label={formElement.label ?? ''}
                        name={formElement.name}
                        options={formElement.options}
                        value={formElement.value}
                      />
                    )
                  }
                  break
                case 'hidden':
                  return (
                    <input
                      key={formElement.name}
                      type="hidden"
                      name={formElement.name}
                      value={formElement.value}
                    />
                  )
                default:
                  return (
                    <Input
                      key={formElement.name}
                      label={formElement.label}
                      name={formElement.name}
                      id={formElement.name}
                      type={formElement.type ?? 'text'}
                      step={formElement.step}
                    />
                  )
              }
            })}
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" disabled={isLoading} onClick={() => setOpen(false)}>
                {closeButtonLabel}
              </Button>
              <LoadingButton type="submit" label={submitButtonLabel} />
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
