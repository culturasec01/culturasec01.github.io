// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://artigos.pages.dev',
	integrations: [mdx(), sitemap()],
	vite: {
		ssr: {
			external: ['svgo'],
		},
	},
});
