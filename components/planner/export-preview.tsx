"use client"

import * as React from "react"
import { WeeklyPlan, DayOfWeek } from "@/types/planner"

interface ExportPreviewProps {
  plan: WeeklyPlan
  days: DayOfWeek[]
}

/**
 * A dedicated, self-contained component that renders as a beautiful horizontal
 * weekly menu. It is appended off-screen when the user triggers an export,
 * captured as an image, and then removed. This ensures the exported PDF always
 * looks pristine regardless of the current page layout or theme.
 */
export function ExportPreview({ plan, days }: ExportPreviewProps) {
  return (
    <div
      id="export-preview-target"
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "1400px",
        backgroundColor: "#fbf9f6",
        fontFamily: "'DM Sans', sans-serif",
        color: "#1b1c1a",
        padding: "48px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
          paddingBottom: "24px",
          borderBottom: "1px solid #e0ddd9",
        }}
      >
        <div>
          <p style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#747872", margin: 0 }}>
            Menú Semanal
          </p>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#1b1c1a",
              margin: "4px 0 0 0",
              fontFamily: "'Libre Caslon Text', Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            Planificación Semanal
          </h1>
        </div>
        <p style={{ fontSize: "12px", color: "#747872", margin: 0 }}>
          {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Day columns */}
      <div style={{ display: "flex", gap: "12px" }}>
        {days.map(day => {
          const lunch = plan[day]?.Lunch
          const dinner = plan[day]?.Dinner
          return (
            <div key={day} style={{ flex: 1, minWidth: 0 }}>
              {/* Day Header */}
              <div
                style={{
                  backgroundColor: "#506052",
                  borderRadius: "8px 8px 0 0",
                  padding: "10px 14px",
                  textAlign: "center",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                  }}
                >
                  {day}
                </span>
              </div>

              {/* Lunch Slot */}
              <MealCard meal="Almuerzo" dish={lunch} />

              {/* Divider */}
              <div style={{ height: "4px" }} />

              {/* Dinner Slot */}
              <MealCard meal="Cena" dish={dinner} />
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #e0ddd9",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "11px", color: "#b5b3ae", margin: 0, letterSpacing: "0.05em" }}>
          Planificador de Menú Semanal
        </p>
      </div>
    </div>
  )
}

function MealCard({ meal, dish }: { meal: string; dish: { title: string; labels: string[] } | null }) {
  return (
    <div
      style={{
        backgroundColor: dish ? "#ffffff" : "#f7f5f2",
        border: "1px solid #e8e5e1",
        borderRadius: "6px",
        padding: "14px",
        minHeight: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: dish ? "flex-start" : "center",
        alignItems: dish ? "flex-start" : "center",
      }}
    >
      <p
        style={{
          fontSize: "9px",
          fontWeight: "700",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#506052",
          margin: "0 0 6px 0",
        }}
      >
        {meal}
      </p>
      {dish ? (
        <>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#1b1c1a",
              margin: "0 0 8px 0",
              lineHeight: "1.3",
              fontFamily: "'Libre Caslon Text', Georgia, serif",
            }}
          >
            {dish.title}
          </p>
          {dish.labels.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "auto" }}>
              {dish.labels.map(l => (
                <span
                  key={l}
                  style={{
                    fontSize: "9px",
                    fontWeight: "600",
                    padding: "2px 7px",
                    borderRadius: "999px",
                    backgroundColor: "#f0edea",
                    color: "#5e5e5d",
                    letterSpacing: "0.04em",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <p style={{ fontSize: "11px", color: "#c3c1bc", margin: 0 }}>—</p>
      )}
    </div>
  )
}
