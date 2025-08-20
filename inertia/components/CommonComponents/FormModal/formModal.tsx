import {Button, Dialog, Flex} from "@radix-ui/themes";
import {PlusIcon} from "@radix-ui/react-icons";
import Input from "~/components/Input/input";
import {FormEvent, ReactNode} from "react";

type FieldConfig<K extends string> = {
  name: K;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "id" | "type">;
  render?: (name: K) => ReactNode; // escape hatch for custom inputs
};

export type FormModalProps<T extends Record<string, unknown>> = {
  actionLabel: string;
  title: string;
  description: string;
  formElements: FieldConfig<Extract<keyof T, string>>[]
  closeButtonLabel?: string;
  submitButtonLabel?: string;
  onSubmit: (payload: T) => Promise<void>;
  onOpenChange?: (open: boolean) => void;
}

export default function FormModal<T extends Record<string, unknown>>({ actionLabel, title, description, formElements, closeButtonLabel = 'Cancel', submitButtonLabel = 'Submit', onSubmit, onOpenChange  }: FormModalProps<T>) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget)

    const payload = formElements.reduce((acc, f) => {
      const raw = fd.get(f.name)
      return {...acc, [f.name]: raw}
    }, {} as T)

    await onSubmit(payload)
    onOpenChange?.(false)
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button radius='full'>
          <PlusIcon />
          { actionLabel }
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{ title }</Dialog.Title>
        <Dialog.Description>{ description }</Dialog.Description>
        <form onSubmit={submit}>
          <Flex direction='column' gap='4'>
            {formElements.map(formElement => (
              <Input
                label={formElement.label}
                name={formElement.name}
                type={formElement.type ?? 'text'}/>
            ))}
            <Flex gap='4' justify='end'>
              <Dialog.Close>
                <Button type='button' variant='surface'>{ closeButtonLabel }</Button>
              </Dialog.Close>
              <Button type='submit'>{ submitButtonLabel }</Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
