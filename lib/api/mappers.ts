import { PlatoAPI } from "@/types/api";
import { Dish } from "@/types/planner";

export function mapPlatoToDish(plato: PlatoAPI): Dish {
  return {
    id: plato.id.toString(),
    title: plato.nombre,
    labels: plato.etiquetas.map(e => e.nombre),
  };
}
