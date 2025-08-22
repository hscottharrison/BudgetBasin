import {Flex, Button, Heading, Container, Box, Avatar} from "@radix-ui/themes";


export default function AppBar(props: any) {
  return (
    <Box style={{ borderBottom: '1px solid var(--gray-a6)', height: '3rem' }}>
      <Container size='4'>
        <Flex className='app-bar-wrapper' as="div" align="center" justify="between" p="2">
          <Heading size="5">Budget Basin</Heading>
          <Flex gap="4">
            {props.user
              ? <Avatar fallback={props.user?.firstName?.[0] ?? ""} radius="full" size='2' />
              : <Button>Sign up for FREE</Button>}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
