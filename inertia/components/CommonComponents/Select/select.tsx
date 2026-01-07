import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

type SelectInputProps = {
  label: string
  name: string
  options: { label: string; value: string }[]
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
  error?: string
}

export default function SelectInput({
  options,
  label,
  name,
  value,
  disabled,
  onChange,
  error,
}: SelectInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={name} className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value || ''} />
    </div>
  )
}
