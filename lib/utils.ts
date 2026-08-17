import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLabelColorClass(label: string): string {
  const normalized = label.toLowerCase();
  
  if (normalized.includes("verdura")) return "!bg-green-300 !text-green-900 dark:!bg-green-900/40 dark:!text-green-300";
  if (normalized.includes("fruta")) return "!bg-orange-300 !text-orange-900 dark:!bg-orange-900/40 dark:!text-orange-300";
  if (normalized.includes("carne")) return "!bg-red-300 !text-red-900 dark:!bg-red-900/40 dark:!text-red-300";
  if (normalized.includes("pescado")) return "!bg-blue-300 !text-blue-900 dark:!bg-blue-900/40 dark:!text-blue-300";
  if (normalized.includes("lacteo") || normalized.includes("lácteo")) return "!bg-cyan-300 !text-cyan-900 dark:!bg-cyan-900/40 dark:!text-cyan-300";
  if (normalized.includes("seco")) return "!bg-amber-300 !text-amber-900 dark:!bg-amber-900/40 dark:!text-amber-300";
  if (normalized.includes("patata")) return "!bg-yellow-300 !text-yellow-900 dark:!bg-yellow-900/40 dark:!text-yellow-300";
  if (normalized.includes("huevo")) return "!bg-yellow-200 !text-yellow-900 dark:!bg-yellow-900/60 dark:!text-yellow-300";
  if (normalized.includes("aceite")) return "!bg-yellow-300 !text-yellow-900 dark:!bg-yellow-900/40 dark:!text-yellow-300";
  if (normalized.includes("cereal")) return "!bg-amber-300 !text-amber-900 dark:!bg-amber-900/40 dark:!text-amber-300";
  
  return "bg-tertiary text-on-tertiary";
}

export function getPdfLabelColor(label: string): { bg: string; text: string } {
  const normalized = label.toLowerCase();
  
  if (normalized.includes("verdura")) return { bg: "#86efac", text: "#14532d" }; // green-300 / green-900
  if (normalized.includes("fruta")) return { bg: "#fdba74", text: "#7c2d12" }; // orange-300 / orange-900
  if (normalized.includes("carne")) return { bg: "#fca5a5", text: "#7f1d1d" }; // red-300 / red-900
  if (normalized.includes("pescado")) return { bg: "#93c5fd", text: "#1e3a8a" }; // blue-300 / blue-900
  if (normalized.includes("lacteo") || normalized.includes("lácteo")) return { bg: "#67e8f9", text: "#164e63" }; // cyan-300 / cyan-900
  if (normalized.includes("seco")) return { bg: "#fcd34d", text: "#78350f" }; // amber-300 / amber-900
  if (normalized.includes("patata")) return { bg: "#fde047", text: "#713f12" }; // yellow-300 / yellow-900
  if (normalized.includes("huevo")) return { bg: "#fef08a", text: "#713f12" }; // yellow-200 / yellow-900
  if (normalized.includes("aceite")) return { bg: "#fde047", text: "#713f12" }; // yellow-300 / yellow-900
  if (normalized.includes("cereal")) return { bg: "#fcd34d", text: "#78350f" }; // amber-300 / amber-900
  
  return { bg: "#f0edea", text: "#5e5e5d" }; // default
}
