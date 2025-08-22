import {Box, Button, Container, Flex, Grid, Heading} from "@radix-ui/themes";

export default function Home() {
  return (
    <Box height='100%' width='100vw' style={{backgroundColor: 'var(--accent-9)'}}>
      <Container size='4' height='100%' style={{height: '100%'}}>
        <Grid height="100%" columns='2'>
          <Flex gap='6' justify='center' align='start' height='100%' direction='column'>
            <Heading as='h1' size='9' style={{ color: '#fff' }}>
              Save Intentionally. Save for your Life.
            </Heading>
            <Heading as='h2' size='5' color='gray'>
              Track your savings goals all and let your money work for you.
            </Heading>
            <a href='/register'>
              <Button size='4' style={{ backgroundColor: '#fff', color: '#000'}}>
                Sign Up for FREE
              </Button>
            </a>
          </Flex>
        </Grid>
      </Container>
    </Box>
  )
}
