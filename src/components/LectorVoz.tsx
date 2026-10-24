import React, { useState, useEffect, useRef } from 'react';

interface LectorVozProps {
  texto: string;
}

export default function LectorVoz({ texto }: LectorVozProps) {
  const [vocesDisponibles, setVocesDisponibles] = useState<SpeechSynthesisVoice[]>([]);
  const [reproduciendo, setReproduciendo] = useState(false);
  
  // Referencias para controlar la cola de lectura sin causar re-renders innecesarios
  const fragmentosRef = useRef<string[]>([]);
  const indiceActualRef = useRef(0);

  useEffect(() => {
    const actualizarVoces = () => {
      if ('speechSynthesis' in window) {
        setVocesDisponibles(window.speechSynthesis.getVoices());
      }
    };

    actualizarVoces();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = actualizarVoces;
    }

    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Función clave: divide el texto largo en oraciones pequeñas
  const dividirTexto = (textoCompleto: string) => {
    // Separa por puntos, signos de interrogación/exclamación o saltos de línea
    const regex = /[^.!?\n]+[.!?\n]+/g;
    const fragmentos = textoCompleto.match(regex);
    return fragmentos ? fragmentos.map(f => f.trim()).filter(f => f.length > 0) : [textoCompleto];
  };

  const leerSiguienteFragmento = () => {
    // Si ya leímos todo, detenemos la reproducción
    if (indiceActualRef.current >= fragmentosRef.current.length) {
      setReproduciendo(false);
      return;
    }

    const fragmento = fragmentosRef.current[indiceActualRef.current];
    const utterance = new SpeechSynthesisUtterance(fragmento);

    const vozLatina = vocesDisponibles.find(
      (voz) => 
        voz.lang === 'es-MX' || 
        voz.lang === 'es-US' || 
        voz.lang === 'es-AR' || 
        voz.lang === 'es-CO' || 
        voz.lang === 'es-CL'
    ) || vocesDisponibles.find((voz) => voz.lang.startsWith('es-'));

    if (vozLatina) {
      utterance.voice = vozLatina;
      utterance.lang = vozLatina.lang;
    } else {
      utterance.lang = 'es-MX';
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Cuando termina un fragmento, avanza al siguiente automáticamente
    utterance.onend = () => {
      indiceActualRef.current++;
      leerSiguienteFragmento();
    };

    utterance.onerror = (e) => {
      console.error("Error en lectura:", e);
      setReproduciendo(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const reproducirVozLatina = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta la lectura de voz.');
      return;
    }

    window.speechSynthesis.cancel(); // Limpia cualquier lectura trabada
    
    // Prepara la lista de frases
    fragmentosRef.current = dividirTexto(texto);
    indiceActualRef.current = 0;
    
    setReproduciendo(true);
    leerSiguienteFragmento(); // Arranca el motor
  };

  const detenerVoz = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setReproduciendo(false);
      fragmentosRef.current = []; // Vacía la cola de frases
    }
  };

  return (
    <div className="flex items-center gap-3 my-4">
      {!reproduciendo ? (
        <button
          onClick={reproducirVozLatina}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
          aria-label="Escuchar texto del capítulo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 15.5v-7L10 5v14l-5-3.5z" />
          </svg>
          Escuchar capítulo
        </button>
      ) : (
        <button
          onClick={detenerVoz}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 font-medium shadow-sm animate-pulse"
          aria-label="Detener lectura"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          Detener lectura
        </button>
      )}
    </div>
  );
}