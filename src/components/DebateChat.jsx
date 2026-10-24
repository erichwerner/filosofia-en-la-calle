import React, { useState, useEffect, useRef } from 'react';
import { obtenerTurnoFilosofos, parsearRespuestaFilosofos } from '../services/debateService';

export default function DebateChat({ capituloId, temaCapitulo, respuestaInicialEstudiante }) {
  // Historial global de mensajes en la bancada central y textos actuales de los filósofos
  const [historialCentral, setHistorialCentral] = useState([
    { remitente: 'estudiante-inicial', texto: respuestaInicialEstudiante }
  ]);
  
  const [dialogoKant, setDialogoKant] = useState("Iniciando análisis deontológico...");
  const [dialogoMill, setDialogoMill] = useState("Preparando cálculo utilitarista...");
  
  const [inputUsuario, setInputUsuario] = useState('');
  const [cargando, setCargando] = useState(false);
  const scrollCentralRef = useRef(null);

  // Efecto de apertura automática al entrar al capítulo
  useEffect(() => {
    async function dispararApertura() {
      setCargando(true);
      try {
        const respuestaCruda = await obtenerTurnoFilosofos(temaCapitulo, respuestaInicialEstudiante, []);
        const { kantTexto, millTexto } = parsearRespuestaFilosofos(respuestaCruda);
        
        setDialogoKant(kantTexto);
        setDialogoMill(millTexto);
      } catch (error) {
        console.error("Error al conectar con la API de Gemini:", error);
      } finally {
        setCargando(false);
      }
    }

    dispararApertura();
  }, [capituloId, temaCapitulo, respuestaInicialEstudiante]);

  // Autoscroll en el ágora del estudiante
  useEffect(() => {
    scrollCentralRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historialCentral, cargando]);

  // Enviar réplica del estudiante
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!inputUsuario.trim() || cargando) return;

    const nuevaIntervencion = { remitente: 'usuario', texto: inputUsuario };
    const nuevoHistorial = [...historialCentral, nuevaIntervencion];
    
    setHistorialCentral(nuevoHistorial);
    setInputUsuario('');
    setCargando(true);

    try {
      // Mapear historial para la IA
      const historialFormateado = nuevoHistorial.map(m => ({
        role: m.remitente === 'usuario' ? 'user' : 'model',
        content: m.texto
      }));

      const respuestaCruda = await obtenerTurnoFilosofos(temaCapitulo, respuestaInicialEstudiante, historialFormateado);
      const { kantTexto, millTexto } = parsearRespuestaFilosofos(respuestaCruda);

      setDialogoKant(kantTexto);
      setDialogoMill(millTexto);

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

      {/* Grid de Tres Bancadas */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        
        {/* 1. BANCADA IZQUIERDA: Immanuel Kant */}
        <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
            <h2 className="font-bold text-indigo-300 text-sm tracking-wide">Immanuel Kant</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl text-sm leading-relaxed text-indigo-100 whitespace-pre-line">
              {cargando ? <span className="animate-pulse text-indigo-400">Formulando imperativo...</span> : dialogoKant}
            </div>
          </div>
        </div>

        {/* 2. BANCADA CENTRAL: El Estudiante y su Ágora */}
        <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <h2 className="font-bold text-amber-300 text-sm tracking-wide">Tu Ágora (Estudiante)</h2>
          </div>
          
          {/* Historial de la bancada central */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl text-xs">
              <span className="text-amber-400 font-semibold block mb-1">Tu postura inicial (A ciegas):</span>
              <p className="italic text-amber-100">"{respuestaInicialEstudiante}"</p>
            </div>

            {historialCentral.filter(m => m.remitente === 'usuario').map((msg, idx) => (
              <div key={idx} className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl text-xs ml-4">
                <span className="text-blue-400 font-semibold block mb-1">Tu réplica:</span>
                <p className="text-blue-100">{msg.texto}</p>
              </div>
            ))}
            <div ref={scrollCentralRef} />
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

        {/* 3. BANCADA DERECHA: John Stuart Mill */}
        <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="font-bold text-emerald-300 text-sm tracking-wide">John Stuart Mill</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl text-sm leading-relaxed text-emerald-100 whitespace-pre-line">
              {cargando ? <span className="animate-pulse text-emerald-400">Calculando utilidad general...</span> : dialogoMill}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}