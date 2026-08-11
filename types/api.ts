export interface EtiquetaAPI {
  id: number;
  nombre: string;
}

export interface PlatoAPI {
  id: number;
  nombre: string;
  descripcion: string;
  etiquetas: EtiquetaAPI[];
}
