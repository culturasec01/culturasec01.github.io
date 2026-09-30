/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				dracula: {
					bg: '#282a36',
					'bg-alt': '#21222c',
					'current': '#44475a',
					foreground: '#f8f8f2',
					comment: '#6272a4',
					cyan: '#8be9fd',
					green: '#50fa7b',
					orange: '#ffb86c',
					pink: '#ff79c6',
					purple: '#bd93f9',
					red: '#ff5555',
					yellow: '#f1fa8c',
				},
			},
			fontFamily: {
				serif: ['Georgia', 'Garamond', 'serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['Fira Code', 'Menlo', 'Monaco', 'monospace'],
			},
			typography: {
				DEFAULT: {
					css: {
						color: '#f8f8f2',
						a: {
							color: '#8be9fd',
							'&:hover': {
								color: '#50fa7b',
							},
						},
						h1: {
							color: '#f8f8f2',
							fontFamily: 'Georgia, serif',
						},
						h2: {
							color: '#f8f8f2',
							fontFamily: 'Georgia, serif',
						},
						h3: {
							color: '#f8f8f2',
						},
						code: {
							color: '#ff79c6',
							backgroundColor: '#44475a',
							padding: '0.2em 0.4em',
							borderRadius: '0.3em',
						},
						'code::before': {
							content: '""',
						},
						'code::after': {
							content: '""',
						},
						pre: {
							backgroundColor: '#21222c',
							borderColor: '#44475a',
						},
						blockquote: {
							borderLeftColor: '#8be9fd',
							color: '#6272a4',
						},
					},
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
