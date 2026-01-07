import { FormEvent } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import Input from '~/components/CommonComponents/Input/input'

import { login } from '~/services/auth_service'

import { LoginDTO } from '#models/auth_dto'

export default function Login() {
  return (
    <div className="h-full w-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input label="Email" name="email" id="email" type="email" />
              <Input label="Password" name="password" id="password" type="password" />
              <div className="flex items-center justify-end gap-3 mt-2">
                <Button type="button" variant="outline">
                  Register
                </Button>
                <Button type="submit">Sign In</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement

    const payload: LoginDTO = {
      email: email.value,
      password: password.value,
    }

    await login(payload)
  }
}
