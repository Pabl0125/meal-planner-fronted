import { useDroppable } from "@dnd-kit/core"
import { Dish, DayOfWeek, MealType } from "@/types/planner"
import { DropZone } from "@/components/ui/drop-zone"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DroppableMealSlotProps {
  day: DayOfWeek; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  meal: MealType; // Lunch or Dinner
  dish: Dish | null; // Dish inside the meal slot
  onRemove?: (day: DayOfWeek, meal: MealType) => void; // Callback function to remove the dish from the meal slot
  onAddClick?: (day: DayOfWeek, meal: MealType) => void; // Callback function to handle the click event on the empty meal slot
}

export function DroppableMealSlot({ day, meal, dish, onRemove, onAddClick }: DroppableMealSlotProps) {
  const id = `${day}-${meal}`;
  // Same as useDraggable, useDroppable returns a setNodeRef function to attach to the droppable element and an isOver boolean indicating if a draggable element is currently over the droppable element
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { day, meal }
  });

  return (
    <div ref={setNodeRef} className="h-full min-h-30">
      {dish ? (
        <Card className="h-full relative group animate-in fade-in zoom-in-95 duration-300">
          <CardContent className="p-4 flex flex-col space-y-2 h-full">
            <h4 className="font-serif text-lg leading-tight">{dish.title}</h4>
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {dish.labels.map(label => (
                <Badge key={label}>{label}</Badge>
              ))}
            </div>
            {onRemove && ( // If the onRemove callback is provided, render a remove button
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
      ) : ( // If there is no dish, render the standard drop zone with a "Add" button
        <div 
          onClick={() => onAddClick?.(day, meal)} // Clik event handler
          className="h-full cursor-pointer hover:opacity-80 transition-opacity"  // style
        >
          <DropZone label={`Add ${meal}`} isOver={isOver} />
        </div>
      )}
    </div>
  )
}


