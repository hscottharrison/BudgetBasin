import './style.css'
import {Box, Text, TextField} from '@radix-ui/themes'

export default function Input(props: any) {
  const { label, type, name, step } = props;
  return (
    <Box>
      <Text as='label' weight='bold'>
        {label}
        <TextField.Root type={type} id={name} name={name} step={step} />
      </Text>
    </Box>
  )
}
