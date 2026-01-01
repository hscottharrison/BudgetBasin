export type MaskType = 'USD' | 'phone' | 'date' | 'EIN' | null

export function formatUSD(value: string): string {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '')

  // Handle empty or invalid input
  if (!numericValue) return ''

  // Parse as float and format
  const parts = numericValue.split('.')
  const integerPart = parts[0] ?? ''
  const decimalPart = parts[1]?.slice(0, 2) ?? ''

  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (decimalPart || numericValue.includes('.')) {
    return `$${formattedInteger}.${decimalPart}`
  }
  return formattedInteger ? `$${formattedInteger}` : ''
}

/**
 * Applies the appropriate mask formatting based on mask type.
 */
export function applyMask(value: string, maskType: MaskType): string {
  switch (maskType) {
    case 'USD':
      return formatUSD(value)
    default:
      return value
  }
}

/**
 * Extracts the raw numeric/unformatted value from a formatted string.
 */
export function getRawValue(value: string, maskType: MaskType): string {
  switch (maskType) {
    case 'USD':
      // Remove $ and commas, keep digits and decimal
      return value.replace(/[$,]/g, '')
    case 'phone':
      // Remove all non-digits
      return value.replace(/\D/g, '')
    case 'date':
      // Remove slashes
      return value.replace(/\//g, '')
    case 'EIN':
      // Remove hyphen
      return value.replace(/-/g, '')
    default:
      return value
  }
}
