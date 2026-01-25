import { Button } from '~/components/ui/button'

export default function AppBar(props: any) {
  return (
    <div className="border-b h-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href={props.user ? '/user-home' : '/'}>
            <h1 className="text-xl font-bold">Budget Basin</h1>
          </a>
          <div className="flex gap-4 items-center">
            {!props.user && (
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
