import { FormEvent, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import Input from '~/components/CommonComponents/Input/input'

import { login } from '~/services/auth_service'

import { LoginDTO } from '#models/auth_dto'

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const payload: LoginDTO = {
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
    }

    await login(payload)
  }

  return (
    <div className="h-full w-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input ref={emailRef} label="Email" name="email" type="email" />
              <Input ref={passwordRef} label="Password" name="password" type="password" />
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
}
