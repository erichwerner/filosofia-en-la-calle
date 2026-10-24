import React, { useState } from 'react';
import { useAppStore } from '../store';
import type { ChapterNode } from '../store';

interface ReflexionPreviaProps {
  capitulo: ChapterNode;
}

export default function ReflexionPrevia({ capitulo }: ReflexionPreviaProps) {
  // Estado local para controlar lo que el alumno escribe en el textarea
  const [texto, setTexto] = useState('');
  
  // Extraemos las acciones de nuestro store global
  const setReflection = useAppStore((state) => state.setReflection);
  const setStage = useAppStore((state) => state.setStage);
  const resetFlow = useAppStore((state) => state.resetFlow);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validamos que al menos haya escrito algo con sustancia (mínimo 10 caracteres)
    if (texto.trim().length >= 10) {
      setReflection(texto); // Guardamos la reflexión en el store global
      setStage('leer');     // Pasamos a la fase de lectura
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4 md:p-8 animate-fade-in-up">
      <div className="bg-white max-w-2xl w-full p-8 md:p-12 rounded-sm shadow-xl border border-stone-200 relative">
        
        {/* Botón para volver atrás si el alumno se arrepiente */}
        <button 
          onClick={resetFlow}
          className="absolute top-6 left-6 text-stone-400 hover:text-crimson transition-colors"
          aria-label="Volver a la selección"
          title="Volver a los capítulos"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="text-center mb-8 mt-4">
          <span className="text-crimson font-sans text-xs tracking-widest uppercase mb-3 block">
            Paso previo a la lectura
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
            {capitulo.title}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mb-6 opacity-50"></div>
          
          <p className="font-serif text-xl text-stone-700 italic">
            "{capitulo.challenge}"
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="reflexion" className="font-sans text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              ¿Qué te sugiere este dilema? Escribe una breve reflexión antes de continuar:
            </label>
            <textarea
              id="reflexion"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full h-48 p-5 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-crimson/30 focus:border-crimson font-serif text-lg resize-none text-ink bg-stone-50/50"
              placeholder="Escribe tus ideas iniciales aquí..."
              required
              minLength={10}
            />
          </div>
          
          <button
            type="submit"
            disabled={texto.trim().length < 10}
            className="w-full bg-ink text-parchment py-4 font-sans uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
          >
            Siguiente: Leer el capítulo
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}