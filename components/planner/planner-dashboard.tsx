"use client"

import * as React from "react"
import { DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Dish, DayOfWeek, MealType, WeeklyPlan } from "@/types/planner"
import { PlatoAPI } from "@/types/api"
import { mapPlatoToDish } from "@/lib/api/mappers"
import { getDishes, createDish, updateDish, deleteDish } from "@/lib/api/dishes"
import { DraggableDish } from "./draggable-dish"
import { DroppableMealSlot } from "./droppable-meal-slot"
import { CreateDishModal } from "./create-dish-modal"
import { SelectDishModal } from "./select-dish-modal"
import { DeleteDishModal } from "./delete-dish-modal"
import { ManageTagsModal } from "./manage-tags-modal"
import { NutritionalGuidelines } from "./nutritional-guidelines"
import { ExportPreview } from "./export-preview"
import { AiChatWidget } from "./ai-chat-widget"
import { ChatAction } from "@/lib/api/chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Menu, Settings, X } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

const DAYS: DayOfWeek[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]


export function PlannerDashboard() {
  const [dishes, setDishes] = React.useState<Dish[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [dishToEdit, setDishToEdit] = React.useState<Dish | null>(null)
  const [dishToDelete, setDishToDelete] = React.useState<Dish | null>(null)
  const [manageTagsOpen, setManageTagsOpen] = React.useState(false)
  
  // Select Dish Modal state
  const [selectModalOpen, setSelectModalOpen] = React.useState(false)
  const [selectDay, setSelectDay] = React.useState<DayOfWeek | null>(null)
  const [selectMeal, setSelectMeal] = React.useState<MealType | null>(null)

  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isExporting, setIsExporting] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)

  // Initialize the weekly plan with null values for each meal slot
  const [plan, setPlan] = React.useState<WeeklyPlan>(() => {
    const initialPlan = {} as WeeklyPlan
    DAYS.forEach(day => {
      initialPlan[day] = { Lunch: null, Dinner: null }
    })
    return initialPlan
  })

  // Fetch from API
  React.useEffect(() => {
    async function loadDishes() {
      try {
        const data = await getDishes()
        setDishes(data)
      } catch (err) {
        console.warn("Backend error:", err)
        setError("Could not load dishes. Please ensure the backend is running.")
      } finally {
        setIsLoading(false)
      }
    }
    loadDishes()
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

  const handleExecuteAiAction = (action: ChatAction) => {
    switch (action.type) {
      case "ASSIGN":
        if (action.day && action.meal && action.dishName) {
          const dishToAssign = dishes.find(d => 
            d.title.toLowerCase().includes(action.dishName!.toLowerCase())
          )
          if (dishToAssign) {
            setPlan(prev => ({
              ...prev,
              [action.day as DayOfWeek]: {
                ...prev[action.day as DayOfWeek],
                [action.meal as MealType]: dishToAssign
              }
            }))
          }
        }
        break;
      case "CLEAR_MEAL":
        if (action.day && action.meal) {
          setPlan(prev => ({
            ...prev,
            [action.day as DayOfWeek]: {
              ...prev[action.day as DayOfWeek],
              [action.meal as MealType]: null
            }
          }))
        }
        break;
      case "CLEAR_WEEK":
        setPlan(() => {
          const initialPlan = {} as WeeklyPlan
          DAYS.forEach(day => {
            initialPlan[day] = { Lunch: null, Dinner: null }
          })
          return initialPlan
        })
        break;
    }
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

  const handleSaveDish = async (dishData: Omit<PlatoAPI, "id">) => {
    if (dishToEdit) {
      try {
        const updatedDish = await updateDish(parseInt(dishToEdit.id, 10), dishData)
        setDishes(prev => prev.map(d => d.id === updatedDish.id ? updatedDish : d))
        
        // Update plan if this dish is placed anywhere
        setPlan(prev => {
          const newPlan = { ...prev };
          DAYS.forEach(day => {
            if (newPlan[day].Lunch?.id === updatedDish.id) newPlan[day].Lunch = updatedDish;
            if (newPlan[day].Dinner?.id === updatedDish.id) newPlan[day].Dinner = updatedDish;
          });
          return newPlan;
        });
      } catch (error) {
        console.warn("Mocking update due to backend error:", error)
        const mockUpdated: PlatoAPI = {
          ...dishData,
          id: parseInt(dishToEdit.id, 10)
        }
        const updatedMockDish = mapPlatoToDish(mockUpdated)
        setDishes(prev => prev.map(d => d.id === updatedMockDish.id ? updatedMockDish : d))
        
        setPlan(prev => {
          const newPlan = { ...prev };
          DAYS.forEach(day => {
            if (newPlan[day].Lunch?.id === updatedMockDish.id) newPlan[day].Lunch = updatedMockDish;
            if (newPlan[day].Dinner?.id === updatedMockDish.id) newPlan[day].Dinner = updatedMockDish;
          });
          return newPlan;
        });
      }
    } else {
      try {
        const createdDish = await createDish(dishData)
        setDishes(prev => [...prev, createdDish])
      } catch (error) {
        console.warn("Mocking creation due to backend error:", error)
        const mockCreated: PlatoAPI = {
          ...dishData,
          id: Date.now() // Mock ID
        }
        setDishes(prev => [...prev, mapPlatoToDish(mockCreated)])
      }
    }
    setDishToEdit(null)
  }

  const handleDeleteDish = async (dish: Dish) => {
    try {
      await deleteDish(parseInt(dish.id, 10))
    } catch (error) {
      console.warn("Mocking delete due to backend error:", error)
    }
    setDishes(prev => prev.filter(d => d.id !== dish.id))
    
    // Remove from plan if assigned
    setPlan(prev => {
      const newPlan = { ...prev };
      DAYS.forEach(day => {
        if (newPlan[day].Lunch?.id === dish.id) newPlan[day].Lunch = null;
        if (newPlan[day].Dinner?.id === dish.id) newPlan[day].Dinner = null;
      });
      return newPlan;
    });
    setDishToDelete(null);
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
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "landscape",
        format: "a4",
      })
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Calculate ratio to fit entirely within A4 (contain)
      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height)
      const finalWidth = imgProps.width * ratio
      const finalHeight = imgProps.height * ratio
      
      // Center the image vertically and horizontally
      const x = (pdfWidth - finalWidth) / 2
      const y = (pdfHeight - finalHeight) / 2

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight)
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
          <h1 className="font-serif text-2xl font-semibold text-on-surface">Menú Semanal</h1>
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
        <aside className={`fixed inset-y-0 right-0 z-50 w-4/5 sm:w-100 lg:static lg:w-100 shrink-0 border-l border-surface-container bg-background p-6 flex flex-col h-full lg:h-screen overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl">Platos</h2>
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
                placeholder="Buscar platos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {uniqueLabels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 items-center">
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
                <Button 
                  variant="ghost" 
                  className="h-7 text-xs px-2.5 rounded-full flex items-center gap-1 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => setManageTagsOpen(true)}
                >
                  <Settings className="h-3 w-3" /> Gestionar
                </Button>
              </div>
            )}
            <Button className="w-full" onClick={() => setIsModalOpen(true)}>
              Crear un nuevo plato
            </Button>
          </div>

          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto no-scrollbar pr-2 pb-20">
            {isLoading ? (
              <p className="text-sm text-outline text-center py-10">Loading dishes...</p>
            ) : error ? (
              <p className="text-sm text-red-500 text-center py-10 px-4">{error}</p>
            ) : filteredDishes.length === 0 ? (
              <p className="text-sm text-outline text-center py-10">No dishes found.</p>
            ) : (
              filteredDishes.map(dish => (
                <DraggableDish 
                  key={dish.id} 
                  dish={dish} 
                  onEdit={(d) => setDishToEdit(d)}
                  onDelete={(d) => setDishToDelete(d)}
                />
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
        isOpen={isModalOpen || dishToEdit !== null} 
        onClose={() => { setIsModalOpen(false); setDishToEdit(null); }} 
        onSubmit={handleSaveDish} 
        initialDish={dishToEdit}
      />

      <SelectDishModal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        onSelect={handleSelectDish}
        dishes={dishes}
        day={selectDay}
        meal={selectMeal}
      />

      {dishToDelete && (
        <DeleteDishModal
          isOpen={!!dishToDelete}
          onClose={() => setDishToDelete(null)}
          onConfirm={() => handleDeleteDish(dishToDelete)}
          dishName={dishToDelete.title}
        />
      )}

      <ManageTagsModal 
        isOpen={manageTagsOpen} 
        onClose={() => setManageTagsOpen(false)} 
      />

      <DragOverlay dropAnimation={null}>
        {activeDish ? (
          <div className="w-70">
            <DraggableDish dish={activeDish} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>

    {/* AI Chat Assistant */}
    <AiChatWidget dishes={dishes} plan={plan} onExecuteAction={handleExecuteAiAction} />

    {/* Off-screen export preview — always mounted so html2canvas can capture it */}
    <ExportPreview plan={plan} days={DAYS} />
    </>
  )
}
