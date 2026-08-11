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

export type WeeklyPlan = Record<DayOfWeek, Record<MealType, Dish | null>>;
