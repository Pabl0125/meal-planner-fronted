import * as React from "react"
import { Dish, DayOfWeek, MealType } from "@/types/planner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SelectDishModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (dish: Dish) => void
  dishes: Dish[]
  day: DayOfWeek | null
  meal: MealType | null
}

export function SelectDishModal({ isOpen, onClose, onSelect, dishes, day, meal }: SelectDishModalProps) {
  const [search, setSearch] = React.useState("")
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>([])
  
  if (!isOpen) return null

  const uniqueLabels = Array.from(new Set(dishes.flatMap(d => d.labels)))

  const filtered = dishes.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
      d.labels.some(l => l.toLowerCase().includes(search.toLowerCase()))
    const matchesLabels = selectedLabels.every(l => d.labels.includes(l))
    return matchesSearch && matchesLabels
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        role="dialog" 
        className="w-full max-w-md bg-surface p-6 rounded-lg shadow-xl"
        onKeyDown={e => e.key === "Escape" && onClose()}
      >
        <h2 className="font-serif text-2xl mb-4 text-on-surface">Select {meal} for {day}</h2>
        <Input 
          autoFocus
          placeholder="Search dishes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4"
        />
        {uniqueLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {uniqueLabels.map(l => {
              const isSelected = selectedLabels.includes(l);
              return (
                <button
                  key={l}
                  onClick={() => setSelectedLabels(prev => 
                    isSelected ? prev.filter(item => item !== l) : [...prev, l]
                  )}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    isSelected 
                      ? "bg-primary text-on-primary" 
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        )}
        <div className="max-h-80 overflow-y-auto no-scrollbar space-y-2 pr-2">
          {filtered.length === 0 && <p className="text-sm text-outline text-center py-4">No dishes found.</p>}
          {filtered.map(dish => (
            <div 
              key={dish.id}
              onClick={() => onSelect(dish)}
              className="p-3 border border-outline-variant rounded-md cursor-pointer hover:bg-surface-container transition-colors"
            >
              <h4 className="font-serif text-lg">{dish.title}</h4>
              <div className="flex gap-1 mt-1">
                {dish.labels.map(l => <Badge key={l}>{l}</Badge>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-surface-container rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  )
}
