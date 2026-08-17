import * as React from "react";
import { Button } from "@/components/ui/button";

interface DeleteDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dishName: string;
}

export function DeleteDishModal({ isOpen, onClose, onConfirm, dishName }: DeleteDishModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleGlobalEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleGlobalEscape);

      return () => window.removeEventListener("keydown", handleGlobalEscape);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        ref={modalRef} 
        role="alertdialog" 
        aria-modal="true" 
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        tabIndex={-1} 
        className="w-full max-w-sm bg-surface p-6 rounded-lg shadow-xl outline-none"
      >
        <h2 id="delete-modal-title" className="font-serif text-xl mb-2 text-on-surface">Eliminar Plato</h2>
        <p id="delete-modal-description" className="text-sm text-secondary mb-6">
          ¿Estás seguro de que quieres eliminar el plato <strong>{dishName}</strong>? Esta acción no se puede deshacer.
        </p>
        
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" className="bg-error text-on-error hover:bg-error/90" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
