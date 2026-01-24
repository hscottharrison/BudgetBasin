import { useCallback, forwardRef } from 'react'
import { Input as BaseInput } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { applyMask, type MaskType } from './masks'
import { cn } from '~/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  maskType?: MaskType
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, maskType, error, className, onChange, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (maskType && onChange) {
          const formatted = applyMask(e.target.value, maskType)
          // Create a custom event-like object with formatted value
          const customEvent = {
            ...e,
            target: {
              ...e.target,
              value: formatted,
            },
          }
          onChange(customEvent as React.ChangeEvent<HTMLInputElement>)
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
          ref={ref}
          className={cn(error && "border-destructive", className)}
          inputMode={maskType === 'USD' ? 'decimal' : undefined}
          onChange={handleChange}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
