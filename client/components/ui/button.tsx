import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive backdrop-blur-md",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:shadow-sky-500/25 hover:scale-105",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/25",
        outline:
          "glass border border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:scale-105 hover:border-sky-400/50",
        secondary:
          "glass bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 hover:scale-105 border border-slate-600/30",
        ghost:
          "hover:bg-slate-700/50 hover:text-slate-200 text-slate-400",
        link: "text-sky-400 underline-offset-4 hover:underline hover:text-sky-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
