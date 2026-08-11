import * as React from "react"

interface GuidelineItemProps {
  emoji: string;
  title: string;
  value: string | React.ReactNode;
}

function GuidelineItem({ emoji, title, value }: GuidelineItemProps) {
  return (
    <div className="flex items-start p-3 bg-surface-container-lowest border border-surface-container rounded-lg">
      <span className="text-2xl mr-3" role="img" aria-label={title}>{emoji}</span>
      <div className="flex flex-col">
        <span className="font-sans text-sm font-bold text-on-surface">{title}</span>
        <span className="font-sans text-sm text-on-surface-variant mt-1">{value}</span>
      </div>
    </div>
  )
}

export function NutritionalGuidelines() {
  const guidelines = [
    { emoji: "🥦", title: "Verduras", value: "1 - 2 raciones/día" },
    { emoji: "🍎", title: "Frutas", value: "1 - 3 raciones/día" },
    { emoji: "🫒", title: "Aceite", value: "2 - 4 raciones/día" },
    { emoji: "🥜", title: "Frutos secos / Legumbres", value: "> 3 raciones/sem" },
    { emoji: "🥔", title: "Patatas / Tubérculos", value: "2 - 3 raciones/sem" },
    { emoji: "🌾", title: "Cereales", value: "2 - 3 raciones/día" },
    { emoji: "🥕", title: "Otros vegetales/frutas", value: "1 raciones/día" },
    { emoji: "🥛", title: "Lácteos", value: "1 - 2 raciones/día" },
    { emoji: "🥚", title: "Huevos", value: "3 - 7 raciones/sem" },
    { 
      emoji: "🐟", 
      title: "Pescado", 
      value: (
        <ul className="list-disc list-inside mt-1">
          <li>AZUL: 1 - 2 raciones/sem</li>
          <li>BLANCO: 1 - 2 raciones/sem</li>
        </ul>
      ) 
    },
    { 
      emoji: "🍗", 
      title: "Carne", 
      value: (
        <ul className="list-disc list-inside mt-1">
          <li>BLANCA: 1 - 2 raciones/sem</li>
          <li>ROJA: &lt; 2 raciones/sem</li>
        </ul>
      ) 
    },
  ];

  return (
    <section className="mt-12 mb-8" aria-labelledby="guidelines-title">
      <h2 id="guidelines-title" className="font-serif text-2xl mb-6 text-on-surface">Recomendaciones Nutricionales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {guidelines.map((item, idx) => (
          <GuidelineItem key={idx} emoji={item.emoji} title={item.title} value={item.value} />
        ))}
      </div>
    </section>
  )
}
