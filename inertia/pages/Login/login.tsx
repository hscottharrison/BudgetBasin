import {FormEvent} from "react";
import {Box, Button, Card, Container, Flex, Heading} from "@radix-ui/themes";
import Input from "~/components/Input/input";
import {login} from "~/services/auth_service";
import {LoginDTO} from "#models/auth_dto";

export default function Login(){
  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const email = document.getElementById("email")as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    const payload: LoginDTO = {
      email: email.value,
      password: password.value,
    }

    await login(payload)
  }

  return (
    <Box height='100%' width='100vw' style={{display: 'flex', alignItems: 'center'}}>
      <Container size='1'>
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction='column' gap='3'>
              <Heading as='h3' mb='1'>Sign In</Heading>
              <Input
                label="Email"
                name="email"
                type="email"/>
              <Input
                label="Password"
                name="password"
                type="password"/>
              <Flex align='center' justify='end' gap='3'>
                <Button type='button' variant='surface'> Register </Button>
                <Button type='submit'> Sign In </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Container>
    </Box>
  )
}
