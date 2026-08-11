// Importamos la etiqueta porque un Plato la necesita
import { Etiqueta } from "./Etiqueta";

export interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  etiquetas: Etiqueta[];
}