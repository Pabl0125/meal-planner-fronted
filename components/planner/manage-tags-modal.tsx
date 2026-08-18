import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EtiquetaAPI } from "@/types/api"
import { getTags, createTag, updateTag, deleteTag } from "@/lib/api/tags"
import { Trash2, X, Plus, Save, Tag as TagIcon, Edit2 } from "lucide-react"

interface ManageTagsModalProps {
  isOpen: boolean
  onClose: () => void
}

// --- Custom Hook Pattern for State & Data Fetching ---
function useManageTags() {
  const [tags, setTags] = React.useState<EtiquetaAPI[]>([])
  const [loading, setLoading] = React.useState(false)

  const fetchTags = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTags()
      setTags(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addTag = async (name: string) => {
    try {
      const tag = await createTag(name)
      setTags(prev => [...prev, tag])
    } catch (err) {
      console.warn("Using mock tag:", err)
      setTags(prev => [...prev, { id: Date.now(), name }])
    }
  }

  const editTag = async (id: number, name: string) => {
    try {
      const tag = await updateTag(id, name)
      setTags(prev => prev.map(t => t.id === id ? tag : t))
    } catch (err) {
      console.warn("Using mock edit:", err)
      setTags(prev => prev.map(t => t.id === id ? { ...t, name } : t))
    }
  }

  const removeTag = async (id: number) => {
    try {
      await deleteTag(id)
    } catch (err) {
      console.warn("Using mock delete:", err)
    }
    setTags(prev => prev.filter(t => t.id !== id))
  }

  return { tags, loading, fetchTags, addTag, editTag, removeTag }
}

// --- Compound Component Pattern for Tabs ---
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}
const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function Tabs({ children, defaultTab }: { children: React.ReactNode, defaultTab: string }) {
  const [activeTab, setActiveTab] = React.useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="flex flex-col h-full overflow-hidden">{children}</div>
    </TabsContext.Provider>
  )
}
function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex space-x-2 p-1.5 bg-surface-container rounded-xl mb-6 shrink-0" role="tablist">{children}</div>
}
function Tab({ id, children }: { id: string, children: React.ReactNode }) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("Tab must be used within Tabs")
  const isActive = context.activeTab === id
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.setActiveTab(id)}
      className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${
        isActive ? "bg-surface shadow-sm text-primary" : "text-secondary hover:text-on-surface hover:bg-surface-container-high"
      }`}
    >
      {children}
    </button>
  )
}
function TabPanel({ id, children }: { id: string, children: React.ReactNode }) {
  const context = React.useContext(TabsContext)
  if (!context || context.activeTab !== id) return null
  return <div role="tabpanel" className="flex-1 overflow-y-auto no-scrollbar pb-2">{children}</div>
}

// --- Controlled Form Pattern ---
function CreateTagForm({ onAdd, tags }: { onAdd: (name: string) => Promise<void>, tags: EtiquetaAPI[] }) {
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const trimmed = name.trim()
    
    if (!trimmed) return
    if (tags.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Ya existe una etiqueta con este nombre.")
      return
    }

    await onAdd(trimmed)
    setName("")
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div>
        <label htmlFor="new-tag" className="block text-sm font-medium text-on-surface mb-2">
          Nombre de la etiqueta <span aria-hidden="true" className="text-error">*</span>
        </label>
        <Input 
          id="new-tag"
          placeholder="Ej. Desayuno, Vegano, Postre..."
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
            setSuccess(false)
          }}
          className="h-12 text-base rounded-xl bg-surface-container/50 border-surface-container-high focus:bg-surface"
          aria-invalid={!!error}
          aria-describedby={error ? "new-tag-error" : undefined}
          autoComplete="off"
        />
        {error && (
          <p id="new-tag-error" role="alert" className="text-sm font-medium text-error mt-2">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" disabled={!name.trim()} className="h-12 w-full rounded-xl font-bold">
        <Plus className="h-5 w-5 mr-2" aria-hidden="true" /> Crear Etiqueta
      </Button>

      {success && (
        <div role="status" aria-live="polite" className="text-center text-sm font-medium text-primary mt-2">
          ¡Etiqueta creada con éxito!
        </div>
      )}
    </form>
  )
}

function EditableTagRow({ 
  tag, 
  onEdit, 
  onDelete, 
  tags 
}: { 
  tag: EtiquetaAPI, 
  onEdit: (id: number, name: string) => Promise<void>, 
  onDelete: (id: number) => Promise<void>,
  tags: EtiquetaAPI[]
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(tag.name)
  const [error, setError] = React.useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = editName.trim()
    if (!trimmed || trimmed === tag.name) {
      setIsEditing(false)
      return
    }

    if (tags.some(t => t.id !== tag.id && t.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("El nombre ya existe.")
      return
    }

    await onEdit(tag.id, trimmed)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl mb-3 border border-primary/20">
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor={`edit-${tag.id}`} className="sr-only">Editar nombre de {tag.name}</label>
          <Input 
            id={`edit-${tag.id}`}
            value={editName}
            onChange={e => {
              setEditName(e.target.value)
              setError(null)
            }}
            autoFocus
            className="h-10 border-none bg-surface shadow-inner"
            aria-invalid={!!error}
            aria-describedby={error ? `edit-error-${tag.id}` : undefined}
          />
          {error && <span id={`edit-error-${tag.id}`} role="alert" className="text-xs font-semibold text-error px-1">{error}</span>}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button type="button" variant="ghost" className="h-10 w-10 p-0 rounded-lg text-secondary hover:bg-surface hover:text-on-surface" onClick={() => setIsEditing(false)} aria-label="Cancelar edición">
            <X className="h-4 w-4" />
          </Button>
          <Button type="submit" className="h-10 w-10 p-0 rounded-lg bg-primary text-on-primary hover:bg-primary/90" aria-label="Guardar cambios">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </form>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-surface border border-surface-container-high hover:border-surface-container-highest rounded-xl mb-3 transition-colors">
        <span className="font-medium text-on-surface text-base ml-2">{tag.name}</span>
        <div className="flex gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            className="h-9 w-9 p-0 rounded-lg text-secondary hover:text-primary hover:bg-primary/10" 
            onClick={() => setIsEditing(true)}
            aria-label={`Editar ${tag.name}`}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="h-9 w-9 p-0 rounded-lg text-secondary hover:text-error hover:bg-error/10" 
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`Eliminar ${tag.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-surface border border-surface-container rounded-2xl shadow-2xl p-6 max-w-sm w-full ring-1 ring-black/5" role="dialog" aria-modal="true" aria-labelledby={`delete-title-${tag.id}`}>
            <h3 id={`delete-title-${tag.id}`} className="text-xl font-bold text-on-surface mb-3">Eliminar Etiqueta</h3>
            <p className="text-secondary text-sm mb-6">
              ¿Estás seguro de que quieres eliminar la etiqueta <strong className="text-on-surface">&quot;{tag.name}&quot;</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-error text-error-foreground hover:bg-error/90" 
                onClick={() => {
                  onDelete(tag.id)
                  setShowDeleteConfirm(false)
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// --- Main Modal Component ---
export function ManageTagsModal({ isOpen, onClose }: ManageTagsModalProps) {
  const { tags, loading, fetchTags, addTag, editTag, removeTag } = useManageTags()
  const modalRef = React.useRef<HTMLDivElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
      fetchTags()
      
      const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose()
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    } else {
      previousFocusRef.current?.focus()
    }
  }, [isOpen, fetchTags, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        aria-hidden="true" 
        onClick={onClose} 
      />
      
      {/* Modal Dialog */}
      <div 
        ref={modalRef} 
        className="relative w-full max-w-md bg-surface overflow-hidden rounded-[2rem] shadow-2xl flex flex-col max-h-full outline-none ring-1 ring-black/5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-tags-title"
        tabIndex={-1}
      >
        <div className="p-8 pb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-primary">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <TagIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 id="manage-tags-title" className="text-2xl font-bold tracking-tight text-on-surface">Etiquetas</h2>
          </div>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            aria-label="Cerrar modal" 
            className="rounded-full h-12 w-12 p-0 bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="px-8 pb-8 flex-1 overflow-hidden flex flex-col">
          <Tabs defaultTab="list">
            <TabList>
              <Tab id="list">Lista de Etiquetas</Tab>
              <Tab id="create">Nueva Etiqueta</Tab>
            </TabList>

            <TabPanel id="list">
              {loading ? (
                <div className="py-12 text-center" role="status" aria-live="polite">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mb-4"></div>
                  <p className="text-secondary font-medium">Cargando...</p>
                </div>
              ) : tags.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center border-2 border-dashed border-surface-container-high rounded-2xl bg-surface-container-lowest">
                  <TagIcon className="h-12 w-12 text-surface-container-highest mb-4" />
                  <p className="text-secondary font-medium text-lg">No hay etiquetas</p>
                  <p className="text-outline text-sm mt-1">Crea una nueva para empezar</p>
                </div>
              ) : (
                tags.map(tag => (
                  <EditableTagRow 
                    key={tag.id} 
                    tag={tag} 
                    onEdit={editTag} 
                    onDelete={removeTag} 
                    tags={tags} 
                  />
                ))
              )}
            </TabPanel>

            <TabPanel id="create">
              <CreateTagForm onAdd={addTag} tags={tags} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
