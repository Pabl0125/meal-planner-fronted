import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlatoAPI, EtiquetaAPI } from "@/types/api";

interface CreateDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dish: Omit<PlatoAPI, "id">) => void;
}

export function CreateDishModal({ isOpen, onClose, onSubmit }: CreateDishModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  const [nombre, setNombre] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  
  const [availableLabels, setAvailableLabels] = React.useState<EtiquetaAPI[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<Set<number>>(new Set());
  const [newLabelsText, setNewLabelsText] = React.useState("");
  
  const [errors, setErrors] = React.useState<{ nombre?: string; descripcion?: string }>({});

  React.useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      
      // Fetch labels
      fetch("http://localhost:8080/api/etiquetas")
        .then(res => res.json())
        .then(data => setAvailableLabels(data))
        .catch(() => setAvailableLabels([
          { id: 1, nombre: "Vegano" },
          { id: 2, nombre: "Vegetariano" },
          { id: 3, nombre: "Saludable" },
          { id: 4, nombre: "Rápido" }
        ]));
    } else {
      previousFocusRef.current?.focus();
      // Reset form
      setNombre("");
      setDescripcion("");
      setSelectedLabelIds(new Set());
      setNewLabelsText("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleLabel = (id: number) => {
    setSelectedLabelIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!descripcion.trim()) newErrors.descripcion = "La descripción es requerida";
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // Combine selected existing labels + new labels
    const finalEtiquetas: EtiquetaAPI[] = availableLabels.filter(lbl => selectedLabelIds.has(lbl.id));
    
    const newLabels = newLabelsText
      .split(",")
      .map(e => e.trim())
      .filter(Boolean)
      .map((name, index) => ({ id: Date.now() + index, nombre: name }));

    onSubmit({
      nombre,
      descripcion,
      etiquetas: [...finalEtiquetas, ...newLabels]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        ref={modalRef} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title" 
        tabIndex={-1} 
        onKeyDown={e => e.key === "Escape" && onClose()}
        className="w-full max-w-md bg-surface p-6 rounded-lg shadow-xl outline-none max-h-[90vh] overflow-y-auto"
      >
        <h2 id="modal-title" className="font-serif text-2xl mb-6 text-on-surface">Crear Nuevo Plato</h2>
        
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="dish-nombre" className="font-sans text-sm font-medium text-on-surface">
              Nombre <span aria-hidden="true" className="text-error">*</span>
            </label>
            <Input
              id="dish-nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              aria-required="true"
              aria-describedby={errors.nombre ? "nombre-error" : undefined}
              aria-invalid={!!errors.nombre}
              error={!!errors.nombre}
              placeholder="Ej. Ensalada César"
            />
            {errors.nombre && (
              <span id="nombre-error" role="alert" className="text-xs text-error mt-1">
                {errors.nombre}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="dish-descripcion" className="font-sans text-sm font-medium text-on-surface">
              Descripción <span aria-hidden="true" className="text-error">*</span>
            </label>
            <textarea
              id="dish-descripcion"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className={`flex min-h-[80px] w-full rounded-md border bg-surface px-3 py-2 text-sm text-on-background placeholder:text-outline focus-visible:outline-none focus-visible:border-primary transition-colors ${errors.descripcion ? 'border-error' : 'border-outline-variant'}`}
              aria-required="true"
              aria-describedby={errors.descripcion ? "descripcion-error" : undefined}
              aria-invalid={!!errors.descripcion}
              placeholder="Breve descripción del plato"
            />
            {errors.descripcion && (
              <span id="descripcion-error" role="alert" className="text-xs text-error mt-1">
                {errors.descripcion}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <span className="font-sans text-sm font-medium text-on-surface">Seleccionar Etiquetas Existentes</span>
            <div className="flex flex-wrap gap-2">
              {availableLabels.map(label => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => handleToggleLabel(label.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors border ${
                    selectedLabelIds.has(label.id) 
                      ? 'bg-primary text-on-primary border-primary' 
                      : 'bg-transparent text-on-surface border-outline hover:bg-surface-container'
                  }`}
                  aria-pressed={selectedLabelIds.has(label.id)}
                >
                  {label.nombre}
                </button>
              ))}
            </div>
            
            <label htmlFor="dish-new-etiquetas" className="font-sans text-sm font-medium text-on-surface mt-2">
              O Crear Nuevas Etiquetas
            </label>
            <Input
              id="dish-new-etiquetas"
              value={newLabelsText}
              onChange={e => setNewLabelsText(e.target.value)}
              placeholder="Ej. Sin Gluten, Postre (separadas por coma)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Plato
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
