# Relatório — site Manus Car Multimarcas

## Veredito
- Site de uma página migrado para a Manus Car, com a estrutura original (header, hero, serviços, depoimentos, sobre, contato, footer).
- Imagens, histórico git, documentação e dados da cópia anterior foram removidos; novo repositório na branch `feat/site-manuscar`.
- `astro check` (0 erros) e build de produção passam.
- Site sem fotos e sem serviços por enquanto (estado "em breve"); sem avaliações individuais.
- Não publicado, sem repositório remoto. `SITE_INDEXABLE = false` (noindex).

## Auditoria de vestígios
Busca sem diferenciar maiúsculas por todos os termos da seção 1 do prompt (nome antigo, endereço, telefone, coordenadas, link do Maps, Instagram, nomes de autores de avaliações etc.) em todos os arquivos, exceto `node_modules`, `.git` e as pastas locais de skills (`.agents/`, `.claude/`, ignoradas pelo git): **0 ocorrências**. Nenhum arquivo com o nome antigo; `dist/` reconstruído do zero.

## Dados usados
Somente a seção 3 do prompt, mais as respostas: telefone (41) 99797-4443 confirmado como WhatsApp; sem Instagram; sem equipe; "Sobre" só com o que os clientes citam (confiança, preço).

## Pendências (TODO(dono) no código)
- Serviços (e fotos): seção mostra "em breve".
- Instagram/site: não existem; contato e rodapé omitem.
- Logo oficial, cores e slogan: logo provisório em texto, cor de destaque `#ff5a36`, slogan factual provisório.
- Texto "Sobre" (história, diferenciais, marcas atendidas).
- Fotos da oficina em `images/` (hero usa gradiente do tema; sem imagem Open Graph).
- Avaliações: colocar `avaliacoes-manuscar.txt` na raiz (`src/data/reviews.ts` está vazio; nota 4,7 · 56 exibida).
- Domínio: `site` em `astro.config.mjs` é `https://example.com`; sitemap/canonical/JSON-LD dependem dele. Sem workflow de deploy (removido).
- Indexação: `SITE_INDEXABLE` está `false`.

## Não executado
Lighthouse e testes manuais em 375/768/1280 px, sem JavaScript e com `prefers-reduced-motion` ainda não foram feitos; não há números a reportar.
