"use client"

import * as React from "react"
import { DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Dish, DayOfWeek, MealType, WeeklyPlan } from "@/types/planner"
import { PlatoAPI } from "@/types/api"
import { mapPlatoToDish } from "@/lib/api/mappers"
import { DraggableDish } from "./draggable-dish"
import { DroppableMealSlot } from "./droppable-meal-slot"
import { CreateDishModal } from "./create-dish-modal"
import { SelectDishModal } from "./select-dish-modal"
import { NutritionalGuidelines } from "./nutritional-guidelines"
import { ExportPreview } from "./export-preview"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Menu, X } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

const DAYS: DayOfWeek[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

// Fallback Mock Data in case the backend is down
const FALLBACK_DISHES: Dish[] = [
  { id: "1", title: "Tostada de Aguacate", labels: ["Vegano", "Rápido"] },
  { id: "2", title: "Salmón a la Plancha", labels: ["Saludable", "Pescetariano"] },
  { id: "3", title: "Ensalada César", labels: ["Vegetariano"] },
]

export function PlannerDashboard() {
  const [dishes, setDishes] = React.useState<Dish[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  
  // Select Dish Modal state
  const [selectModalOpen, setSelectModalOpen] = React.useState(false)
  const [selectDay, setSelectDay] = React.useState<DayOfWeek | null>(null)
  const [selectMeal, setSelectMeal] = React.useState<MealType | null>(null)

  const [isLoading, setIsLoading] = React.useState(true)
  const [isExporting, setIsExporting] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const [plan, setPlan] = React.useState<WeeklyPlan>(() => {
    const initialPlan = {} as WeeklyPlan
    DAYS.forEach(day => {
      initialPlan[day] = { Lunch: null, Dinner: null }
    })
    return initialPlan
  })

  // Fetch from API
  React.useEffect(() => {
    async function fetchDishes() {
      try {
        const res = await fetch("http://localhost:8080/api/platos")
        if (!res.ok) throw new Error("API not accessible")
        const data: PlatoAPI[] = await res.json()
        setDishes(data.map(mapPlatoToDish))
      } catch (error) {
        console.warn("Using fallback dishes. Backend error:", error)
        setDishes(FALLBACK_DISHES)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDishes()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    
    if (over && active.data.current?.dish) {
      const dish = active.data.current.dish as Dish
      const { day, meal } = over.data.current as { day: DayOfWeek, meal: MealType }
      
      setPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: dish
        }
      }))
    }
  }

  const handleRemoveMeal = (day: DayOfWeek, meal: MealType) => {
    setPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: null
      }
    }))
  }

  const handleAddClick = (day: DayOfWeek, meal: MealType) => {
    setSelectDay(day)
    setSelectMeal(meal)
    setSelectModalOpen(true)
  }

  const handleSelectDish = (dish: Dish) => {
    if (selectDay && selectMeal) {
      setPlan(prev => ({
        ...prev,
        [selectDay]: {
          ...prev[selectDay],
          [selectMeal]: dish
        }
      }))
    }
    setSelectModalOpen(false)
  }

  const handleCreateDish = async (newDishData: Omit<PlatoAPI, "id">) => {
    try {
      const res = await fetch("http://localhost:8080/api/platos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDishData)
      })
      if (!res.ok) throw new Error("Failed to create")
      const createdPlato: PlatoAPI = await res.json()
      setDishes(prev => [...prev, mapPlatoToDish(createdPlato)])
    } catch (error) {
      console.warn("Mocking creation due to backend error:", error)
      const mockCreated: PlatoAPI = {
        ...newDishData,
        id: Date.now() // Mock ID
      }
      setDishes(prev => [...prev, mapPlatoToDish(mockCreated)])
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    // Give React a tick to render the ExportPreview into the DOM
    await new Promise(resolve => setTimeout(resolve, 100))
    try {
      const element = document.getElementById("export-preview-target")
      if (!element) throw new Error("Export preview not found")
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fbf9f6",
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      })
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save("menu-semanal.pdf")
    } catch (error) {
      console.error("Error exporting PDF:", error)
    }
    setIsExporting(false)
  }

  const [selectedLabels, setSelectedLabels] = React.useState<string[]>([])

  const uniqueLabels = React.useMemo(() => {
    const labels = new Set<string>()
    dishes.forEach(d => d.labels.forEach(l => labels.add(l)))
    return Array.from(labels)
  }, [dishes])

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLabels = selectedLabels.every(l => dish.labels.includes(l))
    return matchesSearch && matchesLabels;
  }).slice(0, 8)

  const activeDish = React.useMemo(() => dishes.find(d => `dish-${d.id}` === activeId), [activeId, dishes])

  return (
    <>
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-full mx-auto overflow-hidden">
        
        {/* Fixed Topbar */}
        <header className="sticky top-0 z-40 w-full border-b border-surface-container bg-surface/80 backdrop-blur-md px-6 py-4 flex justify-between items-center shrink-0">
          <h1 className="font-serif text-2xl font-semibold text-on-surface">Weekly Menu Planner</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="lg:hidden p-0 h-10 w-10 rounded-full"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Toggle Dishes Sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button 
              variant="secondary" 
              onClick={handleExport}
              disabled={isExporting}
              aria-label="Export Plan to PDF"
              className="rounded-full h-10 w-10 p-0 shadow-sm"
            >
              {isExporting ? <Loader2 className="animate-spin h-5 w-5" /> : <Download className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* Central Dashboard (7 Days) */}
          <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar p-4 lg:p-10 w-full min-w-0">
          
          <div id="weekly-plan-grid" className="grid grid-cols-1 xl:grid-cols-7 gap-4 bg-background p-4 rounded-xl">
            {DAYS.map(day => (
              <div key={day} className="flex flex-col space-y-4">
                <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-outline text-center mb-2">{day}</h2>
                <div className="flex-1">
                  <DroppableMealSlot 
                    day={day} 
                    meal="Lunch" 
                    dish={plan[day].Lunch} 
                    onRemove={handleRemoveMeal} 
                    onAddClick={handleAddClick}
                  />
                </div>
                <div className="flex-1">
                  <DroppableMealSlot 
                    day={day} 
                    meal="Dinner" 
                    dish={plan[day].Dinner} 
                    onRemove={handleRemoveMeal} 
                    onAddClick={handleAddClick}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <NutritionalGuidelines />
        </div>

        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)} 
            aria-hidden="true"
          />
        )}
        
        {/* Right Sidebar */}
        <aside className={`fixed inset-y-0 right-0 z-50 w-4/5 sm:w-[400px] lg:static lg:w-[400px] shrink-0 border-l border-surface-container bg-surface-container-lowest p-6 flex flex-col h-full lg:h-screen overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl">Dishes</h2>
            <Button variant="ghost" className="lg:hidden p-2 rounded-full" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="search-dishes" className="sr-only">Search dishes</label>
              <Input 
                id="search-dishes"
                type="search" 
                placeholder="Search or filter by label..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {uniqueLabels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {uniqueLabels.map(label => {
                  const isSelected = selectedLabels.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => setSelectedLabels(prev => 
                        isSelected ? prev.filter(l => l !== label) : [...prev, label]
                      )}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        isSelected 
                          ? "bg-primary text-on-primary" 
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
            <Button className="w-full" onClick={() => setIsModalOpen(true)}>
              Create New Dish
            </Button>
          </div>

          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto no-scrollbar pr-2 pb-20">
            {isLoading ? (
              <p className="text-sm text-outline text-center py-10">Loading dishes...</p>
            ) : filteredDishes.length === 0 ? (
              <p className="text-sm text-outline text-center py-10">No dishes found.</p>
            ) : (
              filteredDishes.map(dish => (
                <DraggableDish key={dish.id} dish={dish} />
              ))
            )}
            {dishes.length > 8 && filteredDishes.length === 8 && (
              <p className="text-xs text-center text-outline mt-4">Showing top 8 results. Search to see more.</p>
            )}
          </div>
        </aside>
        </div>
      </div>

      <CreateDishModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateDish} 
      />

      <SelectDishModal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        onSelect={handleSelectDish}
        dishes={dishes}
        day={selectDay}
        meal={selectMeal}
      />

      <DragOverlay dropAnimation={null}>
        {activeDish ? (
          <div className="w-[280px]">
            <DraggableDish dish={activeDish} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>

    {/* Off-screen export preview — always mounted so html2canvas can capture it */}
    <ExportPreview plan={plan} days={DAYS} />
    </>
  )
}



