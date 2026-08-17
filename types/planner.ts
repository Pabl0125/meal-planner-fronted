export interface Dish {
  id: string;
  title: string;
  description?: string;
  labels: string[];
}

export type DayOfWeek = 
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

export type MealType = "Lunch" | "Dinner";

export interface MealSlotInfo {
  day: DayOfWeek;
  meal: MealType;
}

export type WeeklyPlan = {
 Lunes: { Lunch: Dish | null, Dinner: Dish | null }
 Martes: { Lunch: Dish | null, Dinner: Dish | null }
 Miércoles: { Lunch: Dish | null, Dinner: Dish | null }
 Jueves: { Lunch: Dish | null, Dinner: Dish | null }
 Viernes: { Lunch: Dish | null, Dinner: Dish | null }
 Sábado: { Lunch: Dish | null, Dinner: Dish | null }
 Domingo: { Lunch: Dish | null, Dinner: Dish | null }
}