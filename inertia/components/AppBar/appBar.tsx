import {Flex, Button, Heading} from "@radix-ui/themes";


export default function AppBar(props: any) {
  console.log(props)
  return (
    <Flex as="div" align="center" justify="between" p="2" style={{ borderBottom: '1px solid var(--gray-a6)' }}>
      <Heading size="5">Budget Basin</Heading>
      <Flex gap="4">
        {props.user
        ? <Button>Sign Out</Button>
        : <Button>Sign In</Button>}
      </Flex>
    </Flex>
  )
}
