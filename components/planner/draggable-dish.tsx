import * as React from "react"
import { useDraggable } from "@dnd-kit/core"
import { Dish } from "@/types/planner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DraggableDishProps {
  dish: Dish;
}

export function DraggableDish({ dish }: DraggableDishProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `dish-${dish.id}`,
    data: { dish },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      elevation={isDragging ? 2 : 1}
      className={`cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing ${isDragging ? "opacity-50 z-50 relative" : ""}`}
      tabIndex={0}
      role="button"
      aria-roledescription="draggable dish"
      aria-label={`Draggable dish: ${dish.title}`}
    >
      <CardContent className="p-4 flex flex-col space-y-2">
        <h4 className="font-serif text-lg leading-tight">{dish.title}</h4>
        <div className="flex flex-wrap gap-1 mt-2">
          {dish.labels.map(label => (
            <Badge key={label}>{label}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
