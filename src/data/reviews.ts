// Avaliações públicas do Google (texto fiel, sem correções; emojis removidos).
// Não há dado de estrelas por avaliação: o site mostra só a nota geral (ver site.ts).

export interface Review {
  id: number;
  /** Nome completo, como aparece no Google. A tela usa nomeExibicao(). */
  author: string;
  localGuide: boolean;
  /** Texto fiel. Se `truncated`, já termina na última frase completa (sem o "…" final). */
  text: string;
  /** O Google cortou o texto: mostrar "…" e "Ler no Google". */
  truncated: boolean;
  /** Um dos 6 destaques iniciais. */
  featured: boolean;
  hidden: boolean;
}

/** Primeiro nome + inicial do último sobrenome (ex.: "Larissa L."). */
export function nomeExibicao(author: string): string {
  const partes = author.trim().split(/\s+/);
  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];
  const inicial = (s: string) => s.charAt(0).toUpperCase();
  if (partes.length === 1) return primeiro;
  // Primeiro nome de uma letra só (ex.: "W Fischer"): "W. Fischer".
  if (primeiro.length === 1) return `${inicial(primeiro)}. ${inicial(ultimo)}${ultimo.slice(1)}`;
  return `${inicial(primeiro)}${primeiro.slice(1)} ${inicial(ultimo)}.`;
}

export function iniciais(author: string): string {
  const partes = author.trim().split(/\s+/);
  const a = partes[0].charAt(0);
  const b = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
  return (a + b).toUpperCase();
}

// TODO(dono): avaliações. Colocar avaliacoes-manuscar.txt na raiz e importar aqui (nenhuma por ora).
export const reviews: Review[] = [];
