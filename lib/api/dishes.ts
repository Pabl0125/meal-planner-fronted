import { Dish } from "@/types/planner"
import { PlatoAPI } from "@/types/api"
import { mapPlatoToDish } from "@/lib/api/mappers"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDishes(): Promise<Dish[]> {
  try {
    const res = await fetch(`${API_URL}/dishes`);
    if (!res.ok) {
      throw new Error(`Error fetching dishes: ${res.statusText}`);
    }
    const data: PlatoAPI[] = await res.json();
    return data.map(mapPlatoToDish);
  } catch (error) {
    console.error("Failed to fetch dishes.", error);
    throw error;
  }
}

export async function createDish(newDishData: Omit<PlatoAPI, "id">): Promise<Dish> {
  try {
    const res = await fetch(`${API_URL}/dishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDishData),
    });
    if (!res.ok) {
      throw new Error(`Error creating dish: ${res.statusText}`);
    }
    const data: PlatoAPI = await res.json();
    return mapPlatoToDish(data);
  } catch (error) {
    console.error("Failed to create dish.", error);
    throw error;
  }
}
