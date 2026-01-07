import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import { useLoading } from '~/context/LoadingContext'
import type { ButtonProps } from '~/components/ui/button'

interface LoadingButtonProps extends ButtonProps {
  label: string
  cb?: () => void
}

export default function LoadingButton({ label, cb, ...props }: LoadingButtonProps) {
  const { isLoading } = useLoading()

  return (
    <Button onClick={cb} disabled={isLoading} {...props}>
      {isLoading ? <Spinner size="sm" /> : label}
    </Button>
  )
}
