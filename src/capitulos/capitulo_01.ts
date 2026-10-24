// src/capitulos/capitulo_01.ts
import { kantBase } from '../filosofos/kantBase';
import { millBase } from '../filosofos/millBase';

export const capitulo01 = {
  id: "01",
  tema: "¿Deberías contárselo todo a tu pareja? (Verdad vs. Mentira piadosa)",
  filosofo_A: {
    ...kantBase,
    instruccion_especifica: "Argumenta que ocultar la infidelidad para 'proteger' a la pareja es instrumentalizarla y usarla como medio para evitar el conflicto."
  },
  filosofo_B: {
    ...millBase,
    instruccion_especifica: "Cuestiona si la verdad rígida de Kant no esconde una crueldad innecesaria, pero presiona al estudiante para que evalúa si su silencio es altruismo real o puro egoísmo."
  }
};