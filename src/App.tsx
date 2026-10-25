import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppStore } from './store';
import { CHAPTER_NODES } from './data/chapters';
import LectorVoz from './components/LectorVoz';
import TextoEnriquecido from './components/TextoEnriquecido';
import ModalReferencia from './components/ModalReferencia';
import SelectorCapitulos from './components/SelectorCapitulos';
import ReflexionPrevia from './components/ReflexionPrevia';
import Inicio from './components/Inicio';
import type { TerminoGlosario } from './data/types';

interface DebateMessage {
  id: string;
  leftPhilosopher: string;
  studentIdea: string;
  rightPhilosopher: string;
}

export default function PhilosophyChatApp() {
  const stage = useAppStore((state) => state.stage);
  const selectedChapterId = useAppStore((state) => state.selectedChapterId);
  const chapterReflection = useAppStore((state) => state.chapterReflection);
  const resetFlow = useAppStore((state) => state.resetFlow);

  const [showChat, setShowChat] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [referenciaAbierta, setReferenciaAbierta] = useState<TerminoGlosario | null>(null);
  
  // Inicializamos el debate a tres columnas con la reflexión inicial del estudiante al centro
  const [debateTurns, setDebateTurns] = useState<DebateMessage[]>(() => {
    return [
      {
        id: '1',
        leftPhilosopher: "Desde la perspectiva de la tradición crítica, toda premisa inicial debe someterse al rigor conceptual antes de proclamarse válida.",
        studentIdea: chapterReflection || "Sin reflexión inicial registrada.",
        rightPhilosopher: "¿No resulta contradictorio sostener esa postura sin antes examinar las condiciones de posibilidad que la sustentan?"
      }
    ];
  });

  const capituloActual = CHAPTER_NODES.find(c => c.id === selectedChapterId);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const nuevaIdeaEstudiante = inputValue;
    setInputValue('');

    // Simulamos la respuesta de los filósofos a ambos lados tras afinar la postura
    setTimeout(() => {
      setDebateTurns(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          leftPhilosopher: "Tu matiz amplía el horizonte, pero la contradicción con el principio general sigue latente.",
          studentIdea: nuevaIdeaEstudiante,
          rightPhilosopher: "Examina con atención: si mantienes esa vía, las consecuencias prácticas colapsan el argumento original."
        }
      ]);
    }, 1000);
  };

  const handleVolverAlIndice = () => {
    setDebateTurns([
      {
        id: '1',
        leftPhilosopher: "Desde la perspectiva de la tradición crítica, toda premisa inicial debe someterse al rigor conceptual antes de proclamarse válida.",
        studentIdea: chapterReflection || "Sin reflexión inicial registrada.",
        rightPhilosopher: "¿No resulta contradictorio sostener esa postura sin antes examinar las condiciones de posibilidad que la sustentan?"
      }
    ]);
    setShowChat(false);
    resetFlow();
  };

  return (
    <div 
      className="flex h-screen font-sans overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: "url('/filosofía en la calle imagen.png')" }}
    >
      <div 
        className={`absolute inset-0 transition-colors duration-1000 z-0 ${
          stage === 'inicio' 
            ? 'bg-ink/75 backdrop-blur-[2px]' 
            : 'bg-parchment/85 backdrop-blur-[4px]'
        }`}
      ></div>

      <div className="relative z-10 w-full h-full overflow-y-auto">
        
        {stage === 'inicio' && <Inicio />}

        {stage === 'seleccionar' && <SelectorCapitulos />}

        {stage === 'reflexionar' && capituloActual && (
          <ReflexionPrevia capitulo={capituloActual} />
        )}

        {stage === 'leer' && capituloActual && (
          <main className="flex flex-col relative min-h-full bg-parchment/95 shadow-2xl max-w-7xl mx-auto border-x border-stone-300">
            <header className="px-8 py-10 lg:px-16 border-b border-stone-300/50 flex-shrink-0 bg-parchment z-10 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <button 
                  onClick={handleVolverAlIndice}
                  className="mb-6 text-stone-500 hover:text-crimson transition-colors font-sans text-xs tracking-widest uppercase flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Índice de Capítulos
                </button>
                <span className="text-xs font-sans font-bold tracking-[0.15em] text-crimson uppercase mb-2 block">
                  El Reto a Debatir
                </span>
                <h2 className="text-3xl lg:text-4xl font-display font-medium text-ink leading-tight text-balance">
                  {capituloActual.challenge}
                </h2>
              </div>
              
              <button 
                onClick={() => setShowChat(!showChat)}
                className={`px-6 py-3 border font-sans text-xs tracking-widest uppercase rounded-sm transition-colors shadow-sm flex-shrink-0 ${
                  showChat 
                    ? 'border-crimson text-crimson hover:bg-crimson hover:text-white' 
                    : 'border-ink text-ink hover:bg-ink hover:text-parchment'
                }`}
              >
                {showChat ? 'Volver a la Lectura' : 'Ir al Ágora (Debate)'}
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-12 lg:px-12 scroll-smooth bg-white/50">
              {!showChat ? (
                <div className="max-w-3xl mx-auto pb-12 animate-fade-in-up">
                  {chapterReflection && (
                    <div className="mb-10 p-6 bg-parchment/50 border-l-4 border-crimson rounded-r-sm italic font-serif text-stone-700 shadow-sm">
                      <span className="block font-sans text-xs font-bold tracking-widest uppercase text-crimson mb-2 not-italic">
                        Tu reflexión inicial:
                      </span>
                      "{chapterReflection}"
                    </div>
                  )}

                  <div className="bg-white border border-stone-200 shadow-md p-8 lg:p-14 rounded-sm text-ink font-serif text-lg leading-loose">
                    {capituloActual.fullText && (
                      <LectorVoz texto={capituloActual.fullText} />
                    )}
                    
                    <hr className="my-8 border-stone-200" />

                    {capituloActual.fullText?.split('\n').map((paragraph, idx) => (
                      <p key={idx} className={paragraph.trim() === '' ? 'h-4' : 'mb-6 text-justify'}>
                        <TextoEnriquecido 
                          texto={paragraph} 
                          onTermClick={setReferenciaAbierta} 
                        />
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                /* ÁGORA DE TRES COLUMNAS */
                <div className="w-full flex flex-col h-full animate-fade-in-up">
                  <div className="text-center mb-10">
                    <span className="font-display text-3xl text-crimson block mb-2">Φ El Ágora: Debate a Tres Bandas</span>
                    <p className="font-serif italic text-stone-600 text-sm">Izquierda: Filósofo A | Centro: Tus propuestas para afinar postura | Derecha: Filósofo B</p>
                  </div>
                  
                  <div className="flex-1 space-y-8 pb-32">
                    {debateTurns.map((turn) => (
                      <div key={turn.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
                        
                        {/* COLUMNA IZQUIERDA: Filósofo A */}
                        <div className="bg-parchment/90 border-l-4 border-crimson p-6 rounded-sm shadow-md flex flex-col justify-between">
                          <div>
                            <span className="block font-sans text-xs font-bold tracking-widest uppercase text-crimson mb-3">
                              Filósofo A (Tradición)
                            </span>
                            <p className="font-serif text-base leading-relaxed text-ink italic">
                              "{turn.leftPhilosopher}"
                            </p>
                          </div>
                        </div>

                        {/* COLUMNA CENTRAL: Propuesta e ideas del Estudiante */}
                        <div className="bg-white border-2 border-stone-300 p-6 rounded-sm shadow-lg flex flex-col justify-between relative transform -translate-y-1">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink text-parthment px-3 py-0.5 rounded text-[10px] uppercase font-sans tracking-widest">
                            Tu Postura
                          </div>
                          <div>
                            <span className="block font-sans text-xs font-bold tracking-widest uppercase text-stone-500 mb-3 text-center">
                              Bancada del Estudiante
                            </span>
                            <p className="font-serif text-lg leading-relaxed text-ink text-center">
                              {turn.studentIdea}
                            </p>
                          </div>
                        </div>

                        {/* COLUMNA DERECHA: Filósofo B / Oposición */}
                        <div className="bg-stone-100 border-l-4 border-stone-600 p-6 rounded-sm shadow-md flex flex-col justify-between">
                          <div>
                            <span className="block font-sans text-xs font-bold tracking-widest uppercase text-stone-600 mb-3">
                              Filósofo B (Contraparte)
                            </span>
                            <p className="font-serif text-base leading-relaxed text-ink italic">
                              "{turn.rightPhilosopher}"
                            </p>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {showChat && (
              <footer className="absolute bottom-0 left-0 right-0 p-8 lg:px-16 bg-gradient-to-t from-parchment via-parchment/95 to-transparent pb-8 z-20">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
                  <div className="absolute inset-0 bg-white shadow-xl shadow-stone-200/50 rounded-sm transform translate-y-1 translate-x-1 border border-stone-200"></div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Afila tu postura o argumenta tu réplica..."
                    className="w-full relative bg-white border border-stone-300 rounded-sm pl-8 pr-28 py-5 font-serif italic text-lg text-ink focus:outline-none focus:ring-1 focus:ring-crimson transition-all shadow-sm"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-5 py-2 bg-ink text-parchment font-sans text-xs tracking-widest uppercase rounded-sm hover:bg-crimson disabled:opacity-30 disabled:hover:bg-ink transition-colors"
                  >
                    Afinar Postura
                  </button>
                </form>
              </footer>
            )}
          </main>
        )}
      </div>

      {referenciaAbierta && (
        <ModalReferencia 
          data={referenciaAbierta} 
          onClose={() => setReferenciaAbierta(null)} 
        />
      )}
    </div>
  );
}