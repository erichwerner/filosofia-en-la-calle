export interface TerminoGlosario {
  term: string;
  title: string;
  category: 'Cine' | 'Arte' | 'Filosofía' | 'Historia' | 'Literatura' | 'Personaje' | 'Actor';
  imageUrl?: string;
  youtubeId?: string;
  videoUrl?: string;
  audioUrl?: string;
  description: string;
  deepDive: string;
}