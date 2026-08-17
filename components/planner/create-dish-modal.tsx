import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlatoAPI, EtiquetaAPI } from "@/types/api";
import { getTags, createTag } from "@/lib/api/tags";

import { Dish } from "@/types/planner";

interface CreateDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dish: any) => Promise<void>;
  initialDish?: Dish | null;
}

export function CreateDishModal({ isOpen, onClose, onSubmit, initialDish }: CreateDishModalProps) {
  // Refs for focus management
  const modalRef = React.useRef<HTMLDivElement>(null); // Save a reference to the modal for focus management
  const previousFocusRef = React.useRef<HTMLElement | null>(null); // Save the previously focused element
  // General descriptions
  const [nombre, setNombre] = React.useState(initialDish?.title || ""); // State for the dish name
  const [descripcion, setDescripcion] = React.useState(initialDish?.description || ""); // State for the dish description
  // Labels
  const [availableLabels, setAvailableLabels] = React.useState<EtiquetaAPI[]>([]); // State for available dish labels
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<Set<number>>(new Set());// State for selected dish labels
  // New label input
  const [isAddingLabel, setIsAddingLabel] = React.useState(false);
  const [newLabelInput, setNewLabelInput] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [errors, setErrors] = React.useState<{ nombre?: string; descripcion?: string }>({});
  
  const resetForm = () => {
    setNombre(initialDish?.title || "");
    setDescripcion(initialDish?.description || "");
    setSelectedLabelIds(new Set());
    setIsAddingLabel(false);
    setNewLabelInput("");
    setErrors({});
  }

  // REMEMBER: The useEffect hook is React's way of saying, "Whenever a specific variable changes, run this block of code."
  // In this case, it runs whenever the isOpen variable changes.
  React.useEffect(() => {
    if (isOpen) {
      // Set initial values if editing
      setNombre(initialDish?.title || "");
      setDescripcion(initialDish?.description || "");
      
      // Save the currently focused element before opening the modal
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus(); // Set focus to the modal when it opens
      
      // Fetch labels using the encapsulated function
      getTags()
        .then(data => {
          setAvailableLabels(data);
          if (initialDish) {
            const selectedIds = new Set<number>();
            data.forEach(lbl => {
              if (initialDish.labels.includes(lbl.name)) {
                selectedIds.add(lbl.id);
              }
            });
            setSelectedLabelIds(selectedIds);
          } else {
            setSelectedLabelIds(new Set());
          }
        })
        .catch(err => console.error("Could not fetch labels:", err));

      const handleGlobalEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleGlobalEscape);

      return () => window.removeEventListener("keydown", handleGlobalEscape);
    } else {
      previousFocusRef.current?.focus(); // REMEMBER: "?" is the optional safety net. "if the thing that is on the left exists, go ahead and call focus()"
      // Reset form
      resetForm();
    }
  }, [isOpen, onClose, initialDish]); // Here we specify that this effect should run whenever isOpen changes.

  if (!isOpen) return null; // If the modal isn't open, don't render anything

  // Once you pass an id to the handler function, it will toggle the selection state of that label
  // If the label is already selected, it will be deselected, and 
  const handleToggleLabel = (id: number) => {
    setSelectedLabelIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  // Once the user has entered a new label name and either pressed Enter or clicked away, this function will attempt to create the new label in the backend
  const handleAddNewLabel = async () => {
    if (newLabelInput.trim()) {
      try {
        const newLabel = await createTag(newLabelInput.trim()); // api call via etiquetas.ts library
        setAvailableLabels(prev => [...prev, newLabel]);
        setSelectedLabelIds(prev => new Set(prev).add(newLabel.id));
        setNewLabelInput("");
        setIsAddingLabel(false);
      } catch (error) {
        console.error("Error al crear la etiqueta:", error);
      }
    } else {
      setIsAddingLabel(false);
    }
  };
  // Handles enter input for new label creation and escape to cancel
  const handleNewLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // REMEMBER: Instead for submitting the fort, Stop! Do not submit the form. Just run my custom code instead
      handleAddNewLabel();
    } else if (e.key === 'Escape') {
      e.stopPropagation(); // REMEMBER: Stop! Do not propagate this event to parent elements. Just run my custom code instead
      setIsAddingLabel(false);
      setNewLabelInput("");
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!descripcion.trim()) newErrors.descripcion = "La descripción es requerida";
    
    // If there are any errors, set them and return early
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // All selected tags are already created in the backend
      const finalEtiquetas: EtiquetaAPI[] = availableLabels.filter(lbl => selectedLabelIds.has(lbl.id));

      await onSubmit({
        name: nombre,
        description: descripcion,
        tags: finalEtiquetas
      });
      onClose();
    } catch (err) {
      console.error("Error al guardar plato", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        ref={modalRef} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title" 
        tabIndex={-1} 
        className="w-full max-w-md bg-surface p-6 rounded-lg shadow-xl outline-none max-h-[90vh] overflow-y-auto"
      >
        <h2 id="modal-title" className="font-serif text-2xl mb-6 text-on-surface">
          {initialDish ? "Editar Plato" : "Crear Nuevo Plato"}
        </h2>
        
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
              className={`flex min-h-20 w-full rounded-md border bg-surface px-3 py-2 text-sm text-on-background placeholder:text-outline focus-visible:outline-none focus-visible:border-primary transition-colors ${errors.descripcion ? 'border-error' : 'border-outline-variant'}`}
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
                  {label.name}
                </button>
              ))}
              {!isAddingLabel ? (
                <button
                  type="button"
                  onClick={() => setIsAddingLabel(true)}
                  className="px-3 py-1 text-xs font-bold rounded-full transition-colors border bg-surface-container text-on-surface border-dashed border-outline hover:bg-surface-container-high"
                >
                  Nueva etiqueta +
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    autoFocus
                    className="h-7 text-xs w-32 px-2 py-1"
                    value={newLabelInput}
                    onChange={e => setNewLabelInput(e.target.value)}
                    onKeyDown={handleNewLabelKeyDown}
                    placeholder="Nombre..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Plato"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
