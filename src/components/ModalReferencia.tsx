import type { TerminoGlosario } from '../data/glosario';

interface ModalReferenciaProps {
  data: TerminoGlosario;
  onClose: () => void;
}

export default function ModalReferencia({ data, onClose }: ModalReferenciaProps) {
  const tieneMultimedia = Boolean(data.imageUrl || data.youtubeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className={`relative bg-parchment w-full max-w-4xl rounded-sm shadow-2xl flex flex-col ${tieneMultimedia ? 'md:flex-row' : ''} overflow-hidden animate-fade-in-up`}>
        
        {/* Zona Visual */}
        {tieneMultimedia && (
          <div className="w-full md:w-2/5 h-64 md:h-auto bg-black relative border-b md:border-b-0 md:border-r border-stone-300">
            
            {data.youtubeId ? (
              <iframe 
                // Cambiamos a youtube.com estándar
                src={`https://www.youtube.com/embed/${data.youtubeId}?rel=0&modestbranding=1`} 
                title={data.title}
                className="absolute inset-0 w-full h-full border-0"
                // Añadimos permisos actualizados
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            ) : data.imageUrl ? (
              <img 
                src={data.imageUrl} 
                alt={data.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
            ) : null}
            
            {!data.youtubeId && (
              <div className="absolute top-4 left-4 bg-ink text-parchment text-xs font-sans tracking-widest uppercase px-3 py-1 rounded-sm shadow-md">
                {data.category}
              </div>
            )}
          </div>
        )}

        {/* Zona de Texto */}
        <div className={`w-full ${tieneMultimedia ? 'md:w-3/5' : 'md:w-full'} p-8 md:p-12 flex flex-col`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-crimson transition-colors z-10"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!tieneMultimedia && (
            <span className="text-crimson font-sans text-xs tracking-widest uppercase mb-3 block">
              {data.category}
            </span>
          )}

          <h3 className="font-display text-3xl text-ink mb-2">{data.title}</h3>
          
          <p className="font-sans text-sm text-stone-500 font-medium mb-6 uppercase tracking-wider text-justify">
            {data.description}
          </p>
          
          <div className="prose prose-stone font-serif text-lg leading-relaxed text-ink/90 overflow-y-auto max-h-[40vh] md:max-h-[50vh] pr-4 custom-scrollbar text-justify">
            <p>{data.deepDive}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-300/50 flex-shrink-0">
            <button 
              onClick={onClose}
              className="w-full py-3 border border-ink text-ink font-sans text-xs tracking-widest uppercase rounded-sm hover:bg-ink hover:text-parchment transition-colors"
            >
              Volver a la lectura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}