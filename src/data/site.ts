// Todo o conteúdo editável do site fica aqui (textos, links, serviços, horários e imagens).

// Versão de teste: não indexável (meta robots noindex + robots.txt com Disallow).
// TODO(dono): trocar para `true` quando o site oficial for ao ar com domínio próprio.
export const SITE_INDEXABLE = false;

export interface Servico {
  titulo: string;
  texto: string;
  icone: string;
  /** Foto opcional. Sem foto, o card usa só o ícone. */
  imagem?: ImageMetadata;
  alt?: string;
}

export interface Horario {
  rotulo: string;
  texto: string;
  /** 0 = domingo ... 6 = sábado */
  dias: number[];
  abre?: string;
  fecha?: string;
}

export const site = {
  nome: 'Manus Car',
  nomeCompleto: 'Manus Car Multimarcas',
  // TODO(dono): slogan oficial. Provisório e factual.
  slogan: 'Oficina mecânica multimarcas no Boqueirão, Curitiba',
  especialidade: 'Oficina mecânica multimarcas',
  titulo: 'Manus Car Multimarcas | Oficina Mecânica no Boqueirão, Curitiba',
  descricao:
    'Manus Car Multimarcas, oficina mecânica no Boqueirão, Curitiba. Nota 4,7 no Google com 56 avaliações. Atendimento de segunda a sexta, das 08:00 às 18:00.',
  endereco: {
    rua: 'Av. Mal. Floriano Peixoto, 7955',
    bairro: 'Boqueirão',
    cidade: 'Curitiba',
    uf: 'PR',
    cep: '81650-000',
    plusCode: 'GQ36+C4',
    lat: -25.496444,
    lng: -49.2396312,
  },
  telefone: '(41) 99797-4443',
  telefoneE164: '+5541997974443',
  whatsapp: 'https://wa.me/5541997974443',
  whatsappMensagem: 'Olá! Gostaria de um orçamento na Manus Car.',
  // TODO(dono): Instagram/site não constam no Google. Preencher se existirem.
  instagram: null as { usuario: string; url: string } | null,
  maps: 'https://www.google.com.br/maps/place/Manus+Car+Multimarcas/@-25.4963009,-49.2396726,18.25z/data=!4m17!1m10!3m9!1s0x94dcfade67f3f103:0x95f0bec518c61446!2sManus+Car+Multimarcas!8m2!3d-25.496444!4d-49.2396312!10e5!14m1!1BCg0KCS9tLzAyNnpzXzAB!16s%2Fg%2F1ptx5rxwg!3m5!1s0x94dcfade67f3f103:0x95f0bec518c61446!8m2!3d-25.496444!4d-49.2396312!16s%2Fg%2F1ptx5rxwg?hl=pt-BR',
  mapsEmbed: 'https://www.google.com/maps?q=Av.+Mal.+Floriano+Peixoto,+7955,+Boqueir%C3%A3o,+Curitiba+-+PR&output=embed',
  avaliacao: { nota: '4,7', notaNumero: 4.7, total: 56 },
  /** Menções contadas pelo Google ("O que mais destacam"). */
  destaquesGoogle: [
    { rotulo: 'Confiança', qtd: 4 },
    { rotulo: 'Preço', qtd: 2 },
  ],
  horarios: [
    { rotulo: 'Segunda a sexta', texto: '08:00 às 18:00', dias: [1, 2, 3, 4, 5], abre: '08:00', fecha: '18:00' },
    { rotulo: 'Sábado e domingo', texto: 'Fechado', dias: [0, 6] },
  ] as Horario[],
  horariosNota: 'Os horários podem variar em feriados.',
  fusoHorario: 'America/Sao_Paulo',

  nav: [
    { rotulo: 'Início', href: '#inicio' },
    { rotulo: 'Serviços', href: '#servicos' },
    { rotulo: 'Depoimentos', href: '#depoimentos' },
    { rotulo: 'Sobre', href: '#sobre' },
    { rotulo: 'Contato', href: '#contato' },
  ],

  // TODO(dono): foto da oficina (pasta images/). Sem foto, o hero usa o fundo do tema.
  hero: {
    imagem: null as ImageMetadata | null,
    alt: 'Manus Car Multimarcas',
  },

  servicosTitulo: 'Serviços',
  servicosIntro: 'Em breve você verá aqui os serviços da Manus Car. Enquanto isso, fale com a gente pelo WhatsApp.',
  // TODO(dono): lista de serviços (e fotos). Não informados.
  servicos: [] as Servico[],

  depoimentosTitulo: 'O que dizem nossos clientes',

  sobre: {
    titulo: 'Confiança e preço',
    // TODO(dono): história, diferenciais e marcas atendidas. Por ora, só o que consta no Google.
    textos: [
      'A Manus Car Multimarcas é uma oficina mecânica no Boqueirão, em Curitiba.',
    ],
    // Menções destacadas pelos clientes no Google.
    diferenciais: ['Confiança', 'Preço'],
  },
};

export function linkWhatsapp(mensagem = site.whatsappMensagem) {
  return `${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
