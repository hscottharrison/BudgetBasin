import {FormEvent} from "react";
import {Card, Link, Container, Box, Flex, Button, Heading, Text} from "@radix-ui/themes";

import Input from '~/components/CommonComponents/Input/input'

import {register} from "~/services/auth_service";


export default function Register() {
  return (
    <Box height='100%' width='100vw' style={{display: 'flex', alignItems: 'center'}}>
      <Container size='1'>
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction='column' gap='3'>
              <Heading as='h3' mb='1'>Create an Account</Heading>
              <Input
                label="First Name"
                name="firstName"
                type='text'/>
              <Input
                label="Last Name"
                name="lastName"
                type='text'/>
              <Input
                label="Email"
                name="email"
                type="email"/>
              <Input
                label="Password"
                name="password"
                type="password"/>
              <Flex direction='column' align='end' justify='center' gap='3'>
                <Button type='button' variant='surface'> Sign In </Button>
                <Text as='div' size='2'>
                  Already have an account? <Link href='/login'>Sign in</Link>
                </Text>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Container>
    </Box>
  )

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;
    const email = document.getElementById("email")as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    const payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    }

    await register(payload)
  }
}
