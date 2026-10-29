// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Versão de teste no GitHub Pages. Com domínio próprio: troque `site` pelo domínio e remova `base`.
export default defineConfig({
  site: 'https://gabrielmensilva.github.io',
  base: '/manus-car',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
