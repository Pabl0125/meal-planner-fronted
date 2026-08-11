import * as React from "react"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

export interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  isOver?: boolean;
}

const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  ({ className, label = "Add Meal", isOver, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center h-full min-h-30 rounded-lg border border-dashed transition-colors",
          "bg-surface-container-lowest text-outline",
          isOver ? "border-primary bg-primary-container/10" : "border-outline-variant",
          className
        )}
        {...props}
      >
        <Plus className="h-6 w-6 mb-2" />
        <span className="font-sans text-sm font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>
    )
  }
)
DropZone.displayName = "DropZone"

export { DropZone }
