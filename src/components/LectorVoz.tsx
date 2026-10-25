interface LectorVozProps {
  texto: string;
}
export default function LectorVoz({ texto }: LectorVozProps) {
  const leerTexto = () => {
    if (!('speechSynthesis' in window)) {
      alert("Tu navegador no soporta la lectura de voz.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  const detenerVoz = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="flex gap-2 my-2">
      <button
        onClick={leerTexto}
        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
      >
        🔊 Escuchar
      </button>
      <button
        onClick={detenerVoz}
        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 transition"
      >
        ⏹️ Detener
      </button>
    </div>
  );
}