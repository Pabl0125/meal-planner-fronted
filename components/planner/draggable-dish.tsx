import { useDraggable } from "@dnd-kit/core"
import { Dish } from "@/types/planner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DraggableDishProps {
  dish: Dish;
}

export function DraggableDish({ dish }: DraggableDishProps) {
  /**
   * attributes: props to spread onte the draggable element
   * listeners: event handlers needed to start dragging
   * setNodeRef: ref to attach to the draggable element
   * transform: the current transformation position of the draggable element (in case is not dragging the value is null))
   * isDragging: boolean indicating if the element is currently being dragged
   */
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `dish-${dish.id}`,
    data: { dish },
  });
  // In case the element is being dragged we apply a transformation to it, otherwise we don't apply any transformation
  const style = transform ? {
    // CSS property to apply to the element
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef} 
      style={style} // No style transformation in case the element is not being dragged
      {...listeners} // Spread the event listeners to the Card component
      {...attributes} // Spread the attributes and listeners to the Card component
      elevation={isDragging ? 2 : 1} // If the element is being draged we apply a higher elevation to it, otherwise we apply a lower elevation
      className={`cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing ${isDragging ? "opacity-50 z-50 relative" : ""}`}
      tabIndex={0} // Make the element focusable for keyboard users
      role="button" // Tells the screen readers that this element is a button, so it can be activated with the keyboard
      aria-roledescription="draggable dish" // Screen readers
      aria-label={`Draggable dish: ${dish.title}`} // Screen readers
    >
      {/*Inner content of the card, including the dish title and labels*/}
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