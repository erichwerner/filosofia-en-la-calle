import { useAppStore } from '../store';
import { CHAPTER_NODES } from '../data/chapters';

export default function SelectorCapitulos() {
  const setSelectedChapter = useAppStore((state) => state.setSelectedChapter);
  const setStage = useAppStore((state) => state.setStage);

  const handleSelect = (id: string) => {
    setSelectedChapter(id);
    setStage('reflexionar');
  };

  return (
    <div className="min-h-screen bg-parchment p-4 md:p-8 animate-fade-in-up pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 mt-8">
          <span className="text-crimson font-sans text-xs tracking-widest uppercase mb-3 block">
            Índice de Contenidos
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-ink">
            Selecciona un Capítulo
          </h1>
        </header>

        <div className="flex flex-col gap-4">
          {CHAPTER_NODES.map((cap) => (
            <button
              key={cap.id}
              onClick={() => handleSelect(cap.id)}
              className="flex flex-col md:flex-row text-left w-full p-6 md:p-8 border border-stone-300 rounded-sm bg-white hover:border-crimson hover:shadow-md transition-all group items-start md:items-center focus:outline-none focus:ring-2 focus:ring-crimson/50 gap-4 md:gap-8"
            >
              <div className="flex-1">
                <h2 className="font-display text-2xl text-ink mb-2 group-hover:text-crimson transition-colors">
                  {cap.title}
                </h2>
                <p className="font-serif text-stone-600 italic text-base leading-relaxed">
                  "{cap.challenge}"
                </p>
              </div>
              
              <div className="flex-shrink-0 flex items-center justify-between md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100 w-full md:w-auto">
                <span className="font-sans text-xs tracking-widest uppercase text-stone-400 group-hover:text-crimson transition-colors">
                  Iniciar lectura
                </span>
                <svg 
                  className="w-4 h-4 text-stone-400 group-hover:text-crimson transition-colors transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}