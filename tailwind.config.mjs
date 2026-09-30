/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f0f4ff',
					100: '#e6edff',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					900: '#1e3a8a',
				},
			},
			fontFamily: {
				mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
			},
		},
	},
	plugins: [],
};
