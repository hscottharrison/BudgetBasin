import { useCallback } from 'react'
import { Input as BaseInput } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { applyMask, getRawValue } from './masks'
import { cn } from '~/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  maskType?: 'USD' | string
  error?: string
}

export default function Input({ label, maskType, error, className, onChange, ...props }: InputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maskType && onChange) {
        const formatted = applyMask(e.target.value, maskType)
        const raw = getRawValue(formatted, maskType)
        // Create a custom event-like object
        const customEvent = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
          },
        }
        onChange(customEvent as any)
      } else if (onChange) {
        onChange(e)
      }
    },
    [maskType, onChange]
  )

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={props.id || props.name}>{label}</Label>}
      <BaseInput
        className={cn(error && "border-destructive", className)}
        inputMode={maskType === 'USD' ? 'decimal' : undefined}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
