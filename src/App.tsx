import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppStore } from './store';
import { CHAPTER_NODES } from './data/chapters';
import { LectorVoz } from './components/LectorVoz';
import TextoEnriquecido from './components/TextoEnriquecido';
import ModalReferencia from './components/ModalReferencia';
import SelectorCapitulos from './components/SelectorCapitulos';
import ReflexionPrevia from './components/ReflexionPrevia';
import Inicio from './components/Inicio';
import type { TerminoGlosario } from './data/types';

export default function PhilosophyChatApp() {
  const stage = useAppStore((state) => state.stage);
  const selectedChapterId = useAppStore((state) => state.selectedChapterId);
  const chapterReflection = useAppStore((state) => state.chapterReflection);
  const resetFlow = useAppStore((state) => state.resetFlow);

  const [showChat, setShowChat] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [referenciaAbierta, setReferenciaAbierta] = useState<TerminoGlosario | null>(null);
  const [localMessages, setLocalMessages] = useState<{role: 'system' | 'user' | 'ai', content: string}[]>([]);

  const capituloActual = CHAPTER_NODES.find(c => c.id === selectedChapterId);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLocalMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');

    setTimeout(() => {
      setLocalMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Resulta intrigante tu argumento. Sin embargo, recordando tu reflexión inicial ("...${chapterReflection?.substring(0, 50) || ''}..."), ¿cómo sostienes esta nueva postura frente a las ideas presentadas por los filósofos en el texto? ¿No crees que hay una contradicción?` 
      }]);
    }, 1200);
  };

  const handleVolverAlIndice = () => {
    setLocalMessages([]);
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
          <main className="flex flex-col relative min-h-full bg-parchment/95 shadow-2xl max-w-5xl mx-auto border-x border-stone-300">
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

            <div className="flex-1 overflow-y-auto px-8 py-12 lg:px-16 scroll-smooth bg-white/50">
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
                <div className="max-w-3xl mx-auto flex flex-col h-full animate-fade-in-up">
                  <div className="flex-1 space-y-8 pb-32">
                    {localMessages.length === 0 && (
                      <div className="text-center py-20 opacity-50">
                        <span className="font-display text-4xl block mb-4">Φ</span>
                        <p className="font-serif italic text-lg">El Ágora está en silencio. Inicia el debate con tus argumentos.</p>
                      </div>
                    )}
                    
                    {localMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? (
                          <div className="max-w-xl bg-white border border-stone-300 text-ink px-8 py-5 rounded-sm shadow-md font-sans font-light">
                            {msg.content}
                          </div>
                        ) : (
                          <div className="max-w-2xl bg-parchment/95 border-l-4 border-crimson pl-8 pr-6 py-6 relative shadow-md rounded-r-sm">
                            <div className="absolute -left-3 top-6 w-6 h-6 rounded-sm border border-stone-400 text-stone-500 flex items-center justify-center bg-parchment-dark shadow-sm">
                              <span className="font-display text-xs italic">Φ</span>
                            </div>
                            <p className="font-serif text-xl leading-loose text-ink">
                              {msg.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {showChat && (
              <footer className="absolute bottom-0 left-0 right-0 p-8 lg:px-16 bg-gradient-to-t from-parchment via-parchment/95 to-transparent pb-8 z-20">
                <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative group">
                  <div className="absolute inset-0 bg-white shadow-xl shadow-stone-200/50 rounded-sm transform translate-y-1 translate-x-1 border border-stone-200"></div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Redacta tu argumento aquí..."
                    className="w-full relative bg-white border border-stone-300 rounded-sm pl-8 pr-24 py-5 font-serif italic text-lg text-ink focus:outline-none focus:ring-1 focus:ring-crimson transition-all shadow-sm"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-5 py-2 bg-ink text-parchment font-sans text-xs tracking-widest uppercase rounded-sm hover:bg-crimson disabled:opacity-30 disabled:hover:bg-ink transition-colors"
                  >
                    Exponer
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