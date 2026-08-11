// app/page.tsx
import { Plato } from "../types"; // O import { Plato } from "@/types" si Next lo configuró

async function getPlatos(): Promise<Plato[]> {
  const res = await fetch("http://localhost:8080/api/platos", { cache: "no-store" });
  
  if (!res.ok) {
    throw new Error("Error al obtener los platos");
  }
  
  return res.json();
}

// En Next.js App Router, los componentes pueden ser asíncronos (async)
export default async function Home() {
  // Llamamos a la API
  const platos = await getPlatos();

  return (
    <main className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Platos</h1>
      
      {/* Cuadrícula responsiva de TailwindCSS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platos.map((plato) => (
          <div key={plato.id} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800">{plato.nombre}</h2>
            <p className="text-gray-600 my-3 text-sm">{plato.descripcion}</p>
            
            {/* Etiquetas del plato */}
            <div className="flex flex-wrap gap-2 mt-4">
              {plato.etiquetas.map(etiqueta => (
                <span key={etiqueta.id} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  {etiqueta.nombre}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}