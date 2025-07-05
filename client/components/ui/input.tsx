import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-slate-300 placeholder:text-slate-400 selection:bg-sky-500 selection:text-white flex h-11 w-full min-w-0 rounded-xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-md px-4 py-2 text-base text-slate-100 shadow-lg transition-all outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-sky-400/70 focus-visible:ring-sky-400/20 focus-visible:ring-4 focus-visible:bg-slate-800/70",
        "aria-invalid:ring-red-400/20 aria-invalid:border-red-400/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
