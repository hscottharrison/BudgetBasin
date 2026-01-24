import { FormEvent, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import Input from '~/components/CommonComponents/Input/input'

import { register } from '~/services/auth_service'

export default function Register() {
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const payload = {
      firstName: firstNameRef.current?.value ?? '',
      lastName: lastNameRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
    }

    await register(payload)
  }

  return (
    <div className="h-full w-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input ref={firstNameRef} label="First Name" name="firstName" type="text" />
              <Input ref={lastNameRef} label="Last Name" name="lastName" type="text" />
              <Input ref={emailRef} label="Email" name="email" type="email" />
              <Input ref={passwordRef} label="Password" name="password" type="password" />
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
}
