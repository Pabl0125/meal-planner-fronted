import { EtiquetaAPI } from "@/types/api";

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    export async function getTags(): Promise<EtiquetaAPI[]> {
      try {
        const res = await fetch(`${API_URL}/tags`);
        if (!res.ok) {
          throw new Error(`Error fetching tags: ${res.statusText}`);
        }
        return await res.json();
      } catch (error) {
        console.error("Failed to fetch tags.", error);
        throw error;
      }
    }

  export async function createTag(name: string): Promise<EtiquetaAPI> {
    try {
      const res = await fetch(`${API_URL}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        throw new Error(`Error creating tag: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.error("Failed to create tag.", error);
      throw error;
    }
  }