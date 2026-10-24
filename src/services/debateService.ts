import { GoogleGenAI } from "@google/genai";
import { kantBase } from "../filosofos/kantBase";
import { millBase } from "../filosofos/millBase";

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

export async function obtenerTurnoFilosofos(
  temaCapitulo: string,
  respuestaInicialEstudiante: string,
  historialChat: Array<{ role: string; content: string }> = []
) {
  const systemInstruction = `
    Actúa como un simulador socrático multijugador para el programa 'Filosofía en la calle'. 
    Debes generar las respuestas de dos filósofos en este debate: ${kantBase.nombre} y ${millBase.nombre}.

    INSTRUCCIONES DE FORMATO ESTRICTAS:
    Tu respuesta DEBE estar dividida exactamente en dos bloques usando las etiquetas [KANT] y [MILL] al inicio de cada intervención. No uses otro formato.
    
    Ejemplo de estructura obligatoria:
    [KANT] (Aquí va el argumento severo de Kant dirigido a la postura del estudiante...)
    [MILL] (Aquí va el contraataque pragmático de Mill...)

    DIRECTRICES DE CONTENIDO:
    - Kant debe usar su rigor deontológico y atacar cualquier justificación emocional o consecuencialista.
    - Mill debe cuestionar la rigidez ciega de Kant, pero exigir al estudiante que justifique su postura desde el bienestar colectivo y la calidad de los actos.
    - Analicen y respondan a la última aportación del estudiante.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      ...historialChat.map(msg => ({ role: msg.role, parts: [{ text: msg.content }] })),
      { 
        role: 'user', 
        parts: [{ text: `[CONTEXTO DE SALA] Tema: "${temaCapitulo}". Postura inicial del estudiante: "${respuestaInicialEstudiante}". Generen su siguiente réplica dividida en [KANT] y [MILL].` }] 
      }
    ],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
}

// Función auxiliar para separar el texto plano que devuelve Gemini en dos objetos independientes
export function parsearRespuestaFilosofos(textoIA: string) {
  let kantTexto = "Kant está reflexionando...";
  let millTexto = "Mill está analizando...";

  try {
    const partesKant = textoIA.split("[KANT]");
    if (partesKant.length > 1) {
      const corteMill = partesKant[1].split("[MILL]");
      kantTexto = corteMill[0].trim();
      if (corteMill.length > 1) {
        millTexto = corteMill[1].trim();
      }
    } else {
      // Fallback por si la IA omite las etiquetas exactas
      kantTexto = textoIA;
    }
  } catch (e) {
    kantTexto = textoIA;
  }

  return { kantTexto, millTexto };
}