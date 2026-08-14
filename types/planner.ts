export interface Dish {
  id: string;
  title: string;
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
 Lunes: Record<MealType, Dish | null>;
 Martes: Record<MealType, Dish | null>;
 Miércoles: Record<MealType, Dish | null>;
 Jueves: Record<MealType, Dish | null>;
 Viernes: Record<MealType, Dish | null>;
 Sábado: Record<MealType, Dish | null>;
 Domingo: Record<MealType, Dish | null>;
}