import { GLOSARIO_FILOSOFICO } from '../data/glosario';
import type { TerminoGlosario } from '../data/types';

interface TextoEnriquecidoProps {
  texto: string;
  onTermClick: (termino: TerminoGlosario) => void;
}

export default function TextoEnriquecido({ texto, onTermClick }: TextoEnriquecidoProps) {
  const terminosOrdenados = [...GLOSARIO_FILOSOFICO].sort((a, b) => b.term.length - a.term.length);
  const pattern = terminosOrdenados.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  if (!pattern) return <>{texto}</>;

  // Asegura que el término no esté pegado a otras letras, respetando los caracteres del español
  const regex = new RegExp(`(?<=^|[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ])(${pattern})(?=[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]|$)`, 'gi');
  const partes = texto.split(regex);

  return (
    <>
      {partes.map((parte, index) => {
        const encontrado = terminosOrdenados.find(t => t.term.toLowerCase() === parte.toLowerCase());

        if (encontrado) {
          return (
            <button 
              key={index}
              onClick={() => onTermClick(encontrado)}
              className="inline text-crimson font-semibold hover:bg-crimson/10 border-b-2 border-crimson/30 hover:border-crimson transition-all px-1 rounded-sm focus:outline-none"
              title={`Ver más sobre ${encontrado.title}`}
            >
              {parte}
            </button>
          );
        }
        return parte;
      })}
    </>
  );
}