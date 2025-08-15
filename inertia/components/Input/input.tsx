import './style.css'
import {Box, Text, TextField} from '@radix-ui/themes'

export default function Input(props: any) {
  const { label, type, name } = props;
  return (
    <Box width="420px">
      <Text as='label' weight='bold'>
        {label}
        <TextField.Root type={type} id={name} />
      </Text>
    </Box>
    // <div className="field">
    //   <label
    //     className="field__label"
    //     htmlFor={name}>
    //     {label}
    //   </label>
    //   <input
    //     className="field__input"
    //     type={type}
    //     name={name}/>
    // </div>
  )
}
