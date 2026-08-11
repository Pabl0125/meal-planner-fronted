import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { Dish, DayOfWeek, MealType } from "@/types/planner"
import { DropZone } from "@/components/ui/drop-zone"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DroppableMealSlotProps {
  day: DayOfWeek;
  meal: MealType;
  dish: Dish | null;
  onRemove?: (day: DayOfWeek, meal: MealType) => void;
  onAddClick?: (day: DayOfWeek, meal: MealType) => void;
}

export function DroppableMealSlot({ day, meal, dish, onRemove, onAddClick }: DroppableMealSlotProps) {
  const id = `${day}-${meal}`;
  
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { day, meal }
  });

  return (
    <div ref={setNodeRef} className="h-full min-h-[120px]">
      {dish ? (
        <Card className="h-full relative group animate-in fade-in zoom-in-95 duration-300">
          <CardContent className="p-4 flex flex-col space-y-2 h-full">
            <h4 className="font-serif text-lg leading-tight">{dish.title}</h4>
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {dish.labels.map(label => (
                <Badge key={label}>{label}</Badge>
              ))}
            </div>
            {onRemove && (
              <button 
                onClick={() => onRemove(day, meal)}
                className="absolute top-2 right-2 p-1 bg-surface-container rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                aria-label={`Remove ${dish.title} from ${day} ${meal}`}
              >
                <span className="text-xs px-1">✕</span>
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div 
          onClick={() => onAddClick?.(day, meal)} 
          className="h-full cursor-pointer hover:opacity-80 transition-opacity"
        >
          <DropZone label={`Add ${meal}`} isOver={isOver} />
        </div>
      )}
    </div>
  )
}


