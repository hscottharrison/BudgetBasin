import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import ConfirmationModal from '~/components/CommonComponents/ConfirmationModal/confirmationModal'

type UserAvatarProps = {
  userFirstName: string
}

export default function UserAvatar({ userFirstName }: UserAvatarProps) {
  /**
   * STATE
   */
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {userFirstName[0].toUpperCase()}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="flex flex-col gap-2">
          <ConfirmationModal
            title="Logout"
            buttonText="Logout"
            buttonVariant="outline"
            description={`Are you sure you want to logout of your account?`}
            onConfirm={logout}
          />
        </div>
      </PopoverContent>
    </Popover>
  )

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    setOpen(false)
    window.location.href = '/'
  }
}
