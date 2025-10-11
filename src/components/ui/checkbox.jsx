import * as React from "react"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const handleChange = (e) => {
    onCheckedChange?.(e.target.checked)
  }

  return (
    <div className="relative">
      <input
        type="checkbox"
        className={`peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:border-gray-600 dark:ring-offset-gray-900 ${className}`}
        checked={checked}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
      {checked && (
        <Check className="absolute top-0 left-0 h-4 w-4 text-white pointer-events-none" />
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }



