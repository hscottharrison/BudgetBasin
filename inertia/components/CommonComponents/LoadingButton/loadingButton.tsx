import { Button, Spinner } from '@radix-ui/themes';
import { useLoading } from '~/context/LoadingContext'

export default function LoadingButton({type, label, cb}: any) {
  const { isLoading } = useLoading();

  return (
    <Button
      type={type}
      onClick={cb}>
      {isLoading ?
        <Spinner size='2'/> :
        label
      }
    </Button>
  )
}
