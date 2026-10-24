import { create } from 'zustand';

// 1. Interfaces de Datos
export interface ChapterNode {
  id: string;
  title: string;
  challenge: string;
  context: string;
  fullText: string;
}

// 2. Tipos para el Flujo de la Aplicación
export type AppStage = 'inicio' | 'seleccionar' | 'reflexionar' | 'leer';

// 3. Interfaz del Estado Global
interface AppState {
  // Estado de navegación
  stage: AppStage;
  selectedChapterId: string | null;
  
  // Datos del estudiante
  chapterReflection: string;

  // Acciones (Mutadores de estado)
  setStage: (stage: AppStage) => void;
  setSelectedChapter: (id: string | null) => void;
  setReflection: (text: string) => void;
  
  // Acción auxiliar para reiniciar el ciclo
  resetFlow: () => void;
}

// 4. Creación del Store
export const useAppStore = create<AppState>((set) => ({
  // Valores iniciales: la aplicación arranca en la portada
  stage: 'inicio',
  selectedChapterId: null,
  chapterReflection: '',

  // Funciones para actualizar el estado
  setStage: (stage) => set({ stage }),
  
  setSelectedChapter: (id) => set({ selectedChapterId: id }),
  
  setReflection: (text) => set({ chapterReflection: text }),
  
  // Al volver al índice, reiniciamos a la vista de selección de capítulos
  resetFlow: () => set({ 
    stage: 'seleccionar', 
    selectedChapterId: null, 
    chapterReflection: '' 
  }),
}));