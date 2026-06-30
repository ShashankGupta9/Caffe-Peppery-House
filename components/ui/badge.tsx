import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-on-primary": variant === "default",
          "border-transparent bg-secondary text-on-secondary": variant === "secondary",
          "border-transparent bg-red-900/40 text-red-400": variant === "destructive",
          "border-transparent bg-green-900/40 text-green-400": variant === "success",
          "border-transparent bg-yellow-900/40 text-yellow-400": variant === "warning",
          "text-on-surface border-outline-variant": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
