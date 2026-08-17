"use client"

import { WeeklyPlan, DayOfWeek } from "@/types/planner"

interface ExportPreviewProps {
  plan: WeeklyPlan
  days: DayOfWeek[]
}

export function ExportPreview({ plan, days }: ExportPreviewProps) {
  return (
    <div className="absolute w-0 h-0 overflow-hidden pointer-events-none">
      <div
        id="export-preview-target"
        className="w-350 h-247.5 bg-white font-sans text-[#1b1c1a] p-12 box-border flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-[#e0ddd9]">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#747872] m-0">
              Menú Semanal
            </p>
            <h1 className="text-[36px] font-bold text-[#1b1c1a] mt-1 font-serif tracking-tight m-0">
              Planificación Semanal
            </h1>
          </div>
          <p className="text-xs text-[#747872] m-0">
            {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Day columns */}
        <div className="flex gap-3">
          {days.map(day => {
            const lunch = plan[day]?.Lunch
            const dinner = plan[day]?.Dinner
            return (
              <div key={day} className="flex-1 min-w-0">
                {/* Day Header */}
                <div className="bg-[#506052] rounded-t-lg px-3.5 py-2.5 text-center mb-1">
                  <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-white">
                    {day}
                  </span>
                </div>

                {/* Lunch Slot */}
                <MealCard meal="Almuerzo" dish={lunch} />

                {/* Divider */}
                <div className="h-1" />

                {/* Dinner Slot */}
                <MealCard meal="Cena" dish={dinner} />
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-5 border-t border-[#e0ddd9] flex justify-center">
          <p className="text-[11px] text-[#b5b3ae] m-0 tracking-wider">
            Planificador de Menú Semanal
          </p>
        </div>
      </div>
    </div>
  )
}

function MealCard({ meal, dish }: { meal: string; dish: { title: string; labels: string[] } | null }) {
  return (
    <div
      className={`border border-[#e8e5e1] rounded-md p-3.5 min-h-25 flex flex-col ${
        dish ? "bg-white justify-start items-start" : "bg-[#f7f5f2] justify-center items-center"
      }`}
    >
      <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-[#506052] m-0 mb-1.5">
        {meal}
      </p>
      {dish ? (
        <>
          <p className="text-sm font-semibold text-[#1b1c1a] m-0 mb-2 leading-[1.3] font-serif">
            {dish.title}
          </p>
          {dish.labels.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-auto">
              {dish.labels.map(l => (
                <span
                  key={l}
                  className="inline-block px-2.5 pt-0.5 pb-3 rounded-full bg-[#f0edea] text-[9px] font-semibold text-[#5e5e5d] tracking-wide text-center"
                >
                  {l}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-[11px] text-[#c3c1bc] m-0">—</p>
      )}
    </div>
  )
}
