export interface EtiquetaAPI {
  id: number;
  name: string;
}

export interface PlatoAPI {
  id: number;
  name: string;
  description: string;
  tags: EtiquetaAPI[];
}
