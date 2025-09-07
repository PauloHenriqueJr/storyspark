import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

interface VisuallyHiddenProps {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

const VisuallyHidden = React.forwardRef<
  HTMLElement,
  VisuallyHiddenProps
>(({ asChild = false, children, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "span"
  
  return (
    <Comp
      ref={ref}
      className={`sr-only ${className || ''}`}
      {...props}
    >
      {children}
    </Comp>
  )
})

VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
