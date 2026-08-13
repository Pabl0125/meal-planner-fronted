import { PlatoAPI } from "@/types/api";
import { Dish } from "@/types/planner";

export function mapPlatoToDish(plato: PlatoAPI): Dish {
  return {
    id: plato.id.toString(),
    title: plato.name,
    labels: plato.tags.map(e => e.name),
  };
}
