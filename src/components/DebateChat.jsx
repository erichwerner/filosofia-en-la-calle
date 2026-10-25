import React, { useState, useEffect, useRef } from 'react';
import { obtenerTurnoFilosofos, parsearRespuestaFilosofos } from '../services/debateService';

export default function DebateChat({ capituloId, temaCapitulo, respuestaInicialEstudiante }) {
  // Historiales separados para conservar el hilo histórico en cada columna
  const [mensajesKant, setMensajesKant] = useState([]);
  const [mensajesMill, setMensajesMill] = useState([]);
  const [historialEstudiante, setHistorialEstudiante] = useState([
    { tipo: 'inicial', texto: respuestaInicialEstudiante }
  ]);
  
  const [inputUsuario, setInputUsuario] = useState('');
  const [cargando,setCargando] = useState(false);
  
  // Referencias para auto-scroll independiente en cada columna
  const scrollKantRef = useRef(null);
  const scrollMillRef = useRef(null);
  const scrollEstudianteRef = useRef(null);

  // Efecto de apertura automática al entrar al capítulo
  useEffect(() => {
    async function dispararApertura() {
      setCargando(true);
      try {
        const respuestaCruda = await obtenerTurnoFilosofos(temaCapitulo, respuestaInicialEstudiante, []);
        const { kantTexto, millTexto } = parsearRespuestaFilosofos(respuestaCruda);
        
        setMensajesKant([kantTexto]);
        setMensajesMill([millTexto]);
      } catch (error) {
        console.error("Error al conectar con la API de Gemini:", error);
      } finally {
        setCargando(false);
      }
    }

    dispararApertura();
  }, [capituloId, temaCapitulo, respuestaInicialEstudiante]);

  // Mantener el scroll al final en las columnas
  useEffect(() => {
    scrollKantRef.current?.scrollIntoView({ behavior: 'smooth' });
    scrollMillRef.current?.scrollIntoView({ behavior: 'smooth' });
    scrollEstudianteRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajesKant, mensajesMill, historialEstudiante, cargando]);

  // Enviar réplica del estudiante
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!inputUsuario.trim() || cargando) return;

    const nuevaIntervencionEstudiante = { tipo: 'replica', texto: inputUsuario };
    const nuevoHistorialEstudiante = [...historialEstudiante, nuevaIntervencionEstudiante];
    
    setHistorialEstudiante(nuevoHistorialEstudiante);
    setInputUsuario('');
    setCargando(true);

    try {
      // Construir historial unificado para que la IA entienda el contexto completo
      // Mapeamos combinando las bancadas o enviando el flujo conversacional general
      const historialFormateado = nuevoHistorialEstudiante.map(m => ({
        role: 'user',
        content: m.texto
      }));

      const respuestaCruda = await obtenerTurnoFilosofos(temaCapitulo, respuestaInicialEstudiante, historialFormateado);
      const { kantTexto, millTexto } = parsearRespuestaFilosofos(respuestaCruda);

      // Acumulamos los nuevos mensajes en los historiales de cada filósofo
      setMensajesKant(prev => [...prev, kantTexto]);
      setMensajesMill(prev => [...prev, millTexto]);

    } catch (error) {
      console.error("Error en el intercambio:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 p-4 font-sans overflow-hidden">
      
      {/* Cabecera */}
      <header className="text-center mb-4 pb-2 border-b border-gray-800">
        <h1 className="text-lg font-bold text-amber-400">Filosofía en la Calle | Capítulo {capituloId}</h1>
        <p className="text-xs text-gray-400">{temaCapitulo}</p>
      </header>

      {/* Grid de Tres Bancadas en Columnas Independientes */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        
        {/* 1. BANCADA IZQUIERDA: Immanuel Kant (Historial Acumulativo) */}
        <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
            <h2 className="font-bold text-indigo-300 text-sm tracking-wide">Immanuel Kant</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {mensajesKant.map((msg, idx) => (
              <div key={idx} className="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl text-sm leading-relaxed text-indigo-100 whitespace-pre-line">
                {msg}
              </div>
            ))}
            {cargando && idx === mensajesKant.length - 1 && (
              <div className="text-xs text-indigo-400 italic animate-pulse">Kant está replicando...</div>
            )}
            <div ref={scrollKantRef} />
          </div>
        </div>

        {/* 2. BANCADA CENTRAL: El Estudiante y su Ágora (Historial Acumulativo) */}
        <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <h2 className="font-bold text-amber-300 text-sm tracking-wide">Tu Ágora (Estudiante)</h2>
          </div>
          
          {/* Historial central del alumno */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {historialEstudiante.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl text-xs ${
                  item.tipo === 'inicial' 
                    ? 'bg-amber-950/30 border border-amber-500/20 text-amber-100' 
                    : 'bg-blue-950/40 border border-blue-500/30 text-blue-100 ml-4'
                }`}
              >
                <span className={`font-semibold block mb-1 ${item.tipo === 'inicial' ? 'text-amber-400' : 'text-blue-400'}`}>
                  {item.tipo === 'inicial' ? 'Tu postura inicial (A ciegas):' : 'Tu réplica:'}
                </span>
                <p className={item.tipo === 'inicial' ? 'italic' : ''}>"{item.texto}"</p>
              </div>
            ))}
            <div ref={scrollEstudianteRef} />
          </div>

          {/* Caja de entrada central */}
          <form onSubmit={manejarEnvio} className="mt-3 flex gap-2 pt-2 border-t border-gray-800">
            <input 
              type="text" 
              value={inputUsuario}
              onChange={(e) => setInputUsuario(e.target.value)}
              placeholder="Escribe tu defensa..."
              disabled={cargando}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-gray-200"
            />
            <button 
              type="submit" 
              disabled={cargando}
              className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 text-gray-950 font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              Defender
            </button>
          </form>
        </div>

        {/* 3. BANCADA DERECHA: John Stuart Mill (Historial Acumulativo) */}
        <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="font-bold text-emerald-300 text-sm tracking-wide">John Stuart Mill</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {mensajesMill.map((msg, idx) => (
              <div key={idx} className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl text-sm leading-relaxed text-emerald-100 whitespace-pre-line">
                {msg}
              </div>
            ))}
            {cargando && (
              <div className="text-xs text-emerald-400 italic animate-pulse">Mill está calculando utilidad...</div>
            )}
            <div ref={scrollMillRef} />
          </div>
        </div>

      </div>
    </div>
  );
}