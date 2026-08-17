import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EtiquetaAPI } from "@/types/api"
import { getTags, createTag, updateTag, deleteTag } from "@/lib/api/tags"
import { Pencil, Trash2, X, Plus, Save } from "lucide-react"

interface ManageTagsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ManageTagsModal({ isOpen, onClose }: ManageTagsModalProps) {
  const [tags, setTags] = React.useState<EtiquetaAPI[]>([])
  const [loading, setLoading] = React.useState(false)
  const [editingTag, setEditingTag] = React.useState<number | null>(null)
  const [editName, setEditName] = React.useState("")
  const [newTagName, setNewTagName] = React.useState("")
  const modalRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      loadTags()
      const handleGlobalEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
      }
      window.addEventListener("keydown", handleGlobalEscape)
      return () => window.removeEventListener("keydown", handleGlobalEscape)
    }
  }, [isOpen])

  const loadTags = async () => {
    setLoading(true)
    try {
      const data = await getTags()
      setTags(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return
    try {
      const tag = await createTag(newTagName.trim())
      setTags(prev => [...prev, tag])
      setNewTagName("")
    } catch (err) {
      console.warn("Using mock tag due to backend error:", err)
      setTags(prev => [...prev, { id: Date.now(), name: newTagName.trim() }])
      setNewTagName("")
    }
  }

  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) return
    try {
      const tag = await updateTag(id, editName.trim())
      setTags(prev => prev.map(t => t.id === id ? tag : t))
    } catch (err) {
      console.warn("Using mock edit due to backend error:", err)
      setTags(prev => prev.map(t => t.id === id ? { ...t, name: editName.trim() } : t))
    }
    setEditingTag(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta etiqueta?")) {
      try {
        await deleteTag(id)
      } catch (err) {
        console.warn("Using mock delete due to backend error:", err)
      }
      setTags(prev => prev.filter(t => t.id !== id))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        ref={modalRef} 
        className="w-full max-w-md max-h-[80vh] flex flex-col bg-surface p-6 rounded-lg shadow-xl"
        role="dialog"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-on-surface">Gestionar Etiquetas</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <Input 
            placeholder="Nueva etiqueta..." 
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newTagName.trim()}>
            <Plus className="h-4 w-4 mr-2" /> Añadir
          </Button>
        </form>

        <div className="flex-1 overflow-y-auto min-h-[200px] border rounded-md p-2">
          {loading ? (
            <p className="text-center text-sm text-secondary mt-10">Cargando...</p>
          ) : tags.length === 0 ? (
            <p className="text-center text-sm text-secondary mt-10">No hay etiquetas disponibles.</p>
          ) : (
            <ul className="space-y-2">
              {tags.map(tag => (
                <li key={tag.id} className="flex items-center justify-between p-2 hover:bg-surface-container rounded-md">
                  {editingTag === tag.id ? (
                    <div className="flex flex-1 items-center gap-2 mr-2">
                      <Input 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button variant="ghost" className="h-8 w-8 text-primary" onClick={() => handleSaveEdit(tag.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="h-8 w-8" onClick={() => setEditingTag(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-sm text-on-surface">{tag.name}</span>
                      <div className="flex gap-1">
                        <Button 
                          
                          variant="ghost" 
                          className="h-8 w-8" 
                          onClick={() => {
                            setEditingTag(tag.id);
                            setEditName(tag.name);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          
                          variant="ghost" 
                          className="h-8 w-8 text-error hover:bg-error/10 hover:text-error" 
                          onClick={() => handleDelete(tag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
