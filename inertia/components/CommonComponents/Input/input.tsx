import { useCallback } from 'react';
import './style.css'
import {Box, Text, TextField} from '@radix-ui/themes'
import { applyMask } from './masks';
import { getRawValue } from './masks';

export default function Input(props: any) {
  const { label, type, name, step, value, onChange, maskType} = props;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = applyMask(e.target.value, maskType)
      const raw = getRawValue(formatted, maskType)
      onChange(raw, formatted) 
    },
    [maskType, onChange],
  )

  return (
    <Box>
      <Text as='label' weight='bold'>
        {label}
        {!!value || !!onChange ? (
          <TextField.Root 
            type={type} 
            id={name} 
            name={name} 
            step={step} 
            value={value} 
            inputMode={maskType === 'USD' ? 'decimal' : 'text'}
            onChange={onChange} 
          />
        ) : (
          <TextField.Root type={type} id={name} name={name} step={step} />
        )}
      </Text>
    </Box>
  )
}
