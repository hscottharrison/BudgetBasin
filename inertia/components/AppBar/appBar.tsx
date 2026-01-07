import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function AppBar(props: any) {
  return (
    <div className="border-b h-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href={props.user ? '/user-home' : '/'}>
            <h1 className="text-xl font-bold">Budget Basin</h1>
          </a>
          <div className="flex gap-4 items-center">
            {props.user ? (
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {props.user?.firstName?.[0] ?? ''}
              </div>
            ) : (
              <a href="/register">
                <Button>Sign up for FREE</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
