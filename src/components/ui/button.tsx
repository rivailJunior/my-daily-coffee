import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-coffee-navy dark:bg-green-500 hover:bg-green-500/80 dark:hover:bg-green-500/80 text-white dark:text-white capitalize',
        destructive:
          'bg-red-500/80 text-white shadow-sm hover:bg-red-500/80 dark:bg-red-450 dark:hover:bg-red-500',
        outline:
          'border border-input bg-background/70 shadow-sm hover:bg-accent hover:text-accent-foreground border-coffee-navy-dark dark:border-green-300 dark:text-green-300 hover:bg-white dark:hover:bg-background/10',
        outlineSecondary:
          'border border-input bg-background/70 shadow-sm hover:bg-accent  border-coffee-coral dark:border-coffee-coral dark:text-coffee-coral hover:bg-white dark:hover:bg-background/10 text-coffee-coral dark:text-coffee-coral',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
