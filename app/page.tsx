import { PlannerDashboard } from "@/components/planner/planner-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="flex-1 bg-background flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <PlannerDashboard />
    </main>
  );
}