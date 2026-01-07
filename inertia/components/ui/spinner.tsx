import { Loader2 } from "lucide-react"

import { cn } from "~/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div role="status" {...props}>
      <Loader2 className={cn("animate-spin", sizeMap[size], className)} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
