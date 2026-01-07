import { FormEvent } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import Input from '~/components/CommonComponents/Input/input'

import { register } from '~/services/auth_service'

export default function Register() {
  return (
    <div className="h-full w-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input label="First Name" name="firstName" id="firstName" type="text" />
              <Input label="Last Name" name="lastName" id="lastName" type="text" />
              <Input label="Email" name="email" id="email" type="email" />
              <Input label="Password" name="password" id="password" type="password" />
              <div className="flex flex-col items-end gap-3 mt-2">
                <Button type="submit">Create Account</Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <a href="/login" className="text-primary hover:underline">
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const firstName = document.getElementById('firstName') as HTMLInputElement
    const lastName = document.getElementById('lastName') as HTMLInputElement
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement

    const payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    }

    await register(payload)
  }
}
