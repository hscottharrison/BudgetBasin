import {Flex, Select, Text} from '@radix-ui/themes'

type SelectInputProps = {
  label: string
  name: string
  options: { label: string; value: string }[]
}

export default function SelectInput({ options, label, name }: SelectInputProps) {
  return (
    <Flex direction='column'>
      <label htmlFor={name}>
        <Text as='label' weight='bold'>
          {label}
        </Text>
      </label>
        <Select.Root name={name}>
          <Select.Trigger />
          <Select.Content>
            {options.map((option) => (
              <Select.Item id={option.value} value={option.value}>{option.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
    </Flex>
  )
}
