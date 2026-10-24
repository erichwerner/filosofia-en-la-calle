import { useAppStore } from '../store';

export default function Inicio() {
  const setStage = useAppStore((state) => state.setStage);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in-up">
        
        {/* Símbolo central */}
        <div className="w-24 h-24 mx-auto border-2 border-parchment/40 rounded-sm transform rotate-45 flex items-center justify-center mb-12 bg-ink/60 backdrop-blur-sm shadow-2xl">
          <div className="transform -rotate-45 text-parchment font-display text-5xl">Φ</div>
        </div>
        
        {/* Títulos */}
        <h1 className="font-display text-6xl md:text-8xl text-parchment mb-6 drop-shadow-2xl tracking-wide">
          Filosofía en la Calle
        </h1>
        
        <p className="font-serif text-xl md:text-2xl text-parchment-dark/90 mb-16 drop-shadow-lg italic leading-relaxed max-w-2xl mx-auto">
          Atrévete a cuestionar tu realidad. Elige un dilema, reflexiona sobre él y entra al Ágora para debatir con los grandes pensadores.
        </p>
        
        {/* Botón de llamada a la acción */}
        <button
          onClick={() => setStage('seleccionar')}
          className="group relative px-8 py-4 bg-crimson text-parchment font-sans text-sm md:text-base tracking-[0.2em] uppercase rounded-sm hover:bg-white hover:text-crimson transition-all duration-300 shadow-xl overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            Comenzar la experiencia
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}